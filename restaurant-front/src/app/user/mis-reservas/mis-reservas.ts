import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReservasService, Reserva } from '../../reservas/reservas';
import { AuthService, Usuario } from '../../auth/auth';
import { PedidosService, Pedido } from '../../pedidos/pedidos';

@Component({
  selector: 'app-mis-reservas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mis-reservas.html',
  styleUrl: './mis-reservas.scss'
})
export class MisReservasComponent implements OnInit {
  misReservas: Reserva[] = [];
  loading = false;
  error = '';

  usuarioActual: Usuario | null = null;

  // Modal para detalles de reserva
  showDetailsModal = false;
  reservaSeleccionada: Reserva | null = null;
  pedidosAsociados: Pedido[] = [];
  loadingPedidos = false;

  constructor(
    private reservasService: ReservasService,
    private authService: AuthService,
    private pedidosService: PedidosService
  ) {}

  ngOnInit() {
    this.usuarioActual = this.authService.getCurrentUser();
    if (this.usuarioActual) {
      this.cargarMisReservas();
    } else {
      this.error = 'No se pudo obtener la información del usuario.';
    }
  }

  cargarMisReservas() {
    if (!this.usuarioActual) {
      this.error = 'No se pudo obtener la información del usuario.';
      return;
    }
    
    this.loading = true;
    this.error = '';
    
    this.reservasService.getReservasByUsuario(this.usuarioActual.id).subscribe({
      next: (reservas) => {
        this.misReservas = reservas.filter(r => r.estado && r.estado.toUpperCase() === 'CONFIRMADA');
        this.loading = false;
      },
      error: (err) => {
        this.error = 'No se pudieron cargar tus reservas.';
        this.loading = false;
        console.error('Error loading user reservations:', err);
      }
    });
  }



  getEstadoClass(estado: string): string {
    switch (estado.toUpperCase()) {
      case 'CONFIRMADA':
        return 'estado-confirmada';
      case 'PENDIENTE':
        return 'estado-pendiente';
      case 'CANCELADA':
        return 'estado-cancelada';
      default:
        return 'estado-pendiente';
    }
  }

  getEstadoText(estado: string): string {
    switch (estado.toUpperCase()) {
      case 'CONFIRMADA':
        return 'Confirmada';
      case 'PENDIENTE':
        return 'Pendiente';
      case 'CANCELADA':
        return 'Cancelada';
      default:
        return estado;
    }
  }

  cancelarReserva(reserva: Reserva) {
    if (confirm('¿Estás seguro de que quieres cancelar esta reserva?')) {
      this.loading = true;
      this.error = '';
      
      this.reservasService.cancelarReserva(reserva.id, 'USUARIO').subscribe({
        next: (reservaCancelada) => {
          // Actualizar la reserva en la lista
          const index = this.misReservas.findIndex(r => r.id === reserva.id);
          if (index !== -1) {
            this.misReservas[index] = reservaCancelada;
          }
          this.loading = false;
          // Refrescar pedidos del usuario
          this.pedidosService.getPedidosByUsuario(this.usuarioActual!.id).subscribe();
        },
        error: (err) => {
          this.error = 'No se pudo cancelar la reserva: ' + (err.error?.message || err.message);
          this.loading = false;
        }
      });
      }
  }

  // Métodos para modal de detalles
  openDetailsModal(reserva: Reserva) {
    this.reservaSeleccionada = reserva;
    this.showDetailsModal = true;
    this.cargarPedidosAsociados(reserva.id);
  }

  closeDetailsModal() {
    this.showDetailsModal = false;
    this.reservaSeleccionada = null;
    this.pedidosAsociados = [];
  }

  cargarPedidosAsociados(reservaId: number) {
    this.loadingPedidos = true;
    
    // Cargar todos los pedidos del usuario y filtrar por reserva
    if (this.usuarioActual) {
      this.pedidosService.getPedidosByUsuario(this.usuarioActual.id).subscribe({
        next: (pedidos) => {
          this.pedidosAsociados = pedidos.filter(pedido => pedido.reservaId === reservaId);
          this.loadingPedidos = false;
        },
        error: (err) => {
          console.error('Error loading associated orders:', err);
          this.pedidosAsociados = [];
          this.loadingPedidos = false;
        }
      });
    }
  }

  // Métodos para estados de pedidos
  getPedidoEstadoClass(estado: string): string {
    switch (estado?.toLowerCase()) {
      case 'en_proceso':
        return 'estado-proceso';
      case 'servido':
        return 'estado-servido';
      case 'pagado':
        return 'estado-pagado';
      case 'cancelado':
        return 'estado-cancelado';
      case 'completado':
        return 'estado-completado';
      default:
        return 'estado-proceso';
    }
  }

  getPedidoEstadoText(estado: string): string {
    switch (estado?.toLowerCase()) {
      case 'en_proceso':
        return 'En Proceso';
      case 'servido':
        return 'Servido';
      case 'pagado':
        return 'Pagado';
      case 'cancelado':
        return 'Cancelado';
      case 'completado':
        return 'Completado';
      default:
        return estado || 'En Proceso';
    }
  }
}
