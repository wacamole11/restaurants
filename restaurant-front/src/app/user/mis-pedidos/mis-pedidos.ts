import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PedidosService, Pedido } from '../../pedidos/pedidos';
import { ReservasService, Reserva } from '../../reservas/reservas';
import { PlatillosService, Platillo } from '../../core/services/platillos';
import { AuthService, Usuario } from '../../auth/auth';

@Component({
  selector: 'app-mis-pedidos',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './mis-pedidos.html',
  styleUrl: './mis-pedidos.scss'
})
export class MisPedidosComponent implements OnInit {
  misPedidos: Pedido[] = [];
  loading = false;
  error = '';
  usuarioActual: Usuario | null = null;

  // Modal para nuevo pedido
  showCreateModal = false;
  creating = false;
  createError = '';
  createSuccess = '';

  // Modal para detalles del pedido
  showDetailsModal = false;
  pedidoSeleccionado: Pedido | null = null;
  cancelando = false;

  // Datos para el formulario
  reservasDisponibles: Reserva[] = [];
  platillosDisponibles: Platillo[] = [];
  pedidoPlatillos: { platillo: Platillo, cantidad: number }[] = [];
  reservaSeleccionada: Reserva | null = null;

  constructor(
    private pedidosService: PedidosService,
    private reservasService: ReservasService,
    private platillosService: PlatillosService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.usuarioActual = this.authService.getCurrentUser();
    if (this.usuarioActual) {
      this.cargarMisPedidos();
      this.cargarReservasDisponibles();
      this.cargarPlatillos();
    } else {
      this.error = 'No se pudo obtener la información del usuario.';
    }
  }

  cargarMisPedidos() {
    if (!this.usuarioActual) {
      this.error = 'No se pudo obtener la información del usuario.';
      return;
    }

    this.loading = true;
    this.error = '';
    
    this.pedidosService.getPedidosByUsuario(this.usuarioActual.id).subscribe({
      next: (pedidos) => {
        // Filtrar pedidos cancelados
        this.misPedidos = pedidos.filter(pedido => pedido.estado !== 'cancelado');
        this.loading = false;
        console.log('Pedidos cargados (sin cancelados):', this.misPedidos);
        console.log('Pedidos cancelados filtrados:', pedidos.filter(p => p.estado === 'cancelado'));
      },
      error: (err) => {
        this.error = 'No se pudieron cargar tus pedidos.';
        this.loading = false;
        console.error('Error loading user orders:', err);
      }
    });
  }

  getEstadoClass(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'en_proceso':
        return 'estado-proceso';
      case 'completado':
        return 'estado-completado';
      case 'cancelado':
        return 'estado-cancelado';
      default:
        return 'estado-proceso';
    }
  }

  getEstadoText(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'en_proceso':
        return 'En Proceso';
      case 'completado':
        return 'Completado';
      case 'cancelado':
        return 'Cancelado';
      default:
        return estado;
    }
  }

  // Métodos para cargar datos
  cargarReservasDisponibles() {
    if (!this.usuarioActual) return;
    
    this.reservasService.getReservasByUsuario(this.usuarioActual.id).subscribe({
      next: (reservas) => {
        // Solo reservas confirmadas, excluyendo canceladas
        this.reservasDisponibles = reservas.filter(r => {
          const estado = r.estado?.toUpperCase();
          return estado === 'CONFIRMADA';
        });
        console.log('Reservas disponibles para pedidos:', this.reservasDisponibles);
      },
      error: (err) => {
        console.error('Error al cargar reservas:', err);
      }
    });
  }

  cargarPlatillos() {
    this.platillosService.getPlatillos().subscribe({
      next: (platillos) => {
        this.platillosDisponibles = platillos.filter(p => p.disponible);
      },
      error: (err) => {
        console.error('Error al cargar platillos:', err);
      }
    });
  }

  // Métodos para crear pedido
  openCreateModal() {
    this.showCreateModal = true;
    this.reservaSeleccionada = null;
    this.pedidoPlatillos = [];
    this.createError = '';
    this.createSuccess = '';
  }

  closeCreateModal() {
    this.showCreateModal = false;
    this.reservaSeleccionada = null;
    this.pedidoPlatillos = [];
    this.createError = '';
    this.createSuccess = '';
  }

  // Métodos para modal de detalles
  openDetailsModal(pedido: Pedido) {
    this.pedidosService.getPedidoById(pedido.id).subscribe({
      next: (pedidoActualizado) => {
        this.pedidoSeleccionado = pedidoActualizado;
        this.showDetailsModal = true;
      },
      error: () => {
        this.pedidoSeleccionado = pedido;
        this.showDetailsModal = true;
      }
    });
  }

  closeDetailsModal() {
    this.showDetailsModal = false;
    this.pedidoSeleccionado = null;
    this.cancelando = false;
  }

  // Método para cancelar pedido
  cancelarPedido() {
    if (!this.pedidoSeleccionado) return;

    if (confirm('¿Estás seguro de que quieres cancelar este pedido? Esta acción no se puede deshacer.')) {
      this.cancelando = true;
      
      // Solo enviar los campos necesarios para la actualización
      const pedidoActualizado = {
        estado: 'cancelado',
        fechaCierre: new Date().toISOString()
      };

      this.pedidosService.updatePedido(this.pedidoSeleccionado.id, pedidoActualizado).subscribe({
        next: (pedidoCancelado) => {
          // Actualizar el pedido en la lista local
          const index = this.misPedidos.findIndex(p => p.id === pedidoCancelado.id);
          if (index !== -1) {
            this.misPedidos[index] = pedidoCancelado;
          }
          
          // Actualizar el pedido seleccionado
          this.pedidoSeleccionado = pedidoCancelado;
          
          this.cancelando = false;
          alert('Pedido cancelado exitosamente');
        },
        error: (err) => {
          this.cancelando = false;
          alert('Error al cancelar el pedido: ' + (err.error?.message || err.message));
          console.error('Error canceling order:', err);
        }
      });
    }
  }

  // Métodos para estados de reserva
  getReservaEstadoText(estado: string): string {
    switch (estado?.toLowerCase()) {
      case 'confirmada':
        return 'Confirmada';
      case 'pendiente':
        return 'Pendiente';
      case 'cancelada':
        return 'Cancelada';
      case 'completada':
        return 'Completada';
      default:
        return estado || 'Desconocido';
    }
  }

  getReservaEstadoClass(estado: string): string {
    switch (estado?.toLowerCase()) {
      case 'confirmada':
        return 'estado-confirmada';
      case 'pendiente':
        return 'estado-pendiente';
      case 'cancelada':
        return 'estado-cancelada';
      case 'completada':
        return 'estado-completada';
      default:
        return 'estado-desconocido';
    }
  }

  // Métodos para crear pedido
  agregarPlatillo(platillo: Platillo) {
    const existente = this.pedidoPlatillos.find(p => p.platillo.id === platillo.id);
    if (!existente) {
      this.pedidoPlatillos.push({ platillo, cantidad: 1 });
    }
  }

  quitarPlatillo(platillo: Platillo) {
    this.pedidoPlatillos = this.pedidoPlatillos.filter(p => p.platillo.id !== platillo.id);
  }

  cambiarCantidad(platillo: Platillo, cantidad: number) {
    const item = this.pedidoPlatillos.find(p => p.platillo.id === platillo.id);
    if (item) {
      item.cantidad = cantidad > 0 ? cantidad : 1;
    }
  }

  crearPedido() {
    if (!this.reservaSeleccionada || this.pedidoPlatillos.length === 0) {
      this.createError = 'Selecciona una reserva y al menos un platillo.';
      return;
    }

    // Validar que la reserva no esté cancelada
    if (this.reservaSeleccionada.estado?.toUpperCase() === 'CANCELADA') {
      this.createError = 'No se puede crear un pedido para una reserva cancelada.';
      return;
    }

    // Validar que la reserva esté confirmada
    if (this.reservaSeleccionada.estado?.toUpperCase() !== 'CONFIRMADA') {
      this.createError = 'Solo se pueden crear pedidos para reservas confirmadas.';
      return;
    }

    this.creating = true;
    this.createError = '';
    this.createSuccess = '';

    // Usar el formato correcto para el backend (CreatePedidoDTO)
    const pedido = {
      reservaId: this.reservaSeleccionada.id,
      usuarioId: this.usuarioActual!.id,
      total: this.calcularTotal(),
      estado: 'en_proceso',
      detalles: this.pedidoPlatillos.map(p => ({
        platilloId: p.platillo.id,
        cantidad: p.cantidad,
        precioUnitario: p.platillo.precio
      }))
    };

    this.pedidosService.createPedido(pedido).subscribe({
      next: (nuevoPedido) => {
        this.misPedidos.push(nuevoPedido);
        this.createSuccess = '¡Pedido creado exitosamente!';
        this.creating = false;
        setTimeout(() => this.closeCreateModal(), 1500);
      },
      error: (err) => {
        this.createError = 'Error al crear el pedido: ' + (err.error?.message || err.message);
        this.creating = false;
      }
    });
  }

  // Métodos helper
  platilloEnPedido(platillo: Platillo): boolean {
    return this.pedidoPlatillos.some(p => p.platillo.id === platillo.id);
  }

  obtenerCantidad(platillo: Platillo): number {
    const item = this.pedidoPlatillos.find(p => p.platillo.id === platillo.id);
    return item ? item.cantidad : 1;
  }

  calcularTotal(): number {
    return this.pedidoPlatillos.reduce((sum, p) => sum + (p.platillo.precio * p.cantidad), 0);
  }

  onCantidadChange(platillo: Platillo, event: any): void {
    const cantidad = parseInt(event.target.value) || 1;
    this.cambiarCantidad(platillo, cantidad);
  }
}
