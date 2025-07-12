import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservasService, Reserva } from '../../reservas/reservas';
import { PedidosService, Pedido } from '../../pedidos/pedidos';
import { AuthService, Usuario } from '../../auth/auth';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial.html',
  styleUrl: './historial.scss'
})
export class HistorialComponent implements OnInit {
  reservasHistorial: Reserva[] = [];
  pedidosHistorial: Pedido[] = [];
  usuarioActual: Usuario | null = null;
  loading = false;
  error = '';

  // Modales de detalles
  showReservaModal = false;
  reservaSeleccionada: Reserva | null = null;
  showPedidoModal = false;
  pedidoSeleccionado: Pedido | null = null;

  constructor(
    private reservasService: ReservasService,
    private pedidosService: PedidosService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.usuarioActual = this.authService.getCurrentUser();
    if (this.usuarioActual) {
      this.cargarHistorial();
    }
  }

  cargarHistorial() {
    this.loading = true;
    this.error = '';
    // Cargar reservas canceladas y finalizadas
    this.reservasService.getReservasByUsuario(this.usuarioActual!.id).subscribe({
      next: (reservas) => {
        this.reservasHistorial = reservas.filter(r => r.estado === 'CANCELADA' || r.estado === 'FINALIZADA');
      },
      error: (err) => {
        this.error = 'Error al cargar reservas.';
      }
    });
    // Cargar todos los pedidos del usuario
    this.pedidosService.getPedidosByUsuario(this.usuarioActual!.id).subscribe({
      next: (pedidos) => {
        this.pedidosHistorial = pedidos;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar pedidos.';
        this.loading = false;
      }
    });
  }

  abrirDetallesReserva(reserva: Reserva) {
    this.reservaSeleccionada = reserva;
    this.showReservaModal = true;
  }
  cerrarDetallesReserva() {
    this.showReservaModal = false;
    this.reservaSeleccionada = null;
  }
  abrirDetallesPedido(pedido: Pedido) {
    this.pedidoSeleccionado = pedido;
    this.showPedidoModal = true;
  }
  cerrarDetallesPedido() {
    this.showPedidoModal = false;
    this.pedidoSeleccionado = null;
  }

  // Método para cancelar pedido
  cancelarPedido(pedido: Pedido) {
    if (!pedido) return;

    // Validar que el pedido se pueda cancelar
    if (pedido.estado === 'cancelado' || pedido.estado === 'completado') {
      alert('Este pedido no se puede cancelar porque ya está ' + pedido.estado + '.');
      return;
    }

    // Validar que la reserva asociada no esté cancelada
    if (pedido.reservaId) {
      const reserva = this.reservasHistorial.find(r => r.id === pedido.reservaId);
      if (reserva && reserva.estado === 'CANCELADA') {
        alert('No se puede cancelar un pedido de una reserva cancelada.');
        return;
      }
    }

    if (confirm('¿Estás seguro de que quieres cancelar este pedido? Esta acción no se puede deshacer.')) {
      // Solo enviar los campos necesarios para la actualización
      const pedidoActualizado = {
        estado: 'cancelado',
        fechaCierre: new Date().toISOString()
      };

      this.pedidosService.updatePedido(pedido.id, pedidoActualizado).subscribe({
        next: (pedidoCancelado) => {
          // Actualizar el pedido en la lista local
          const index = this.pedidosHistorial.findIndex(p => p.id === pedidoCancelado.id);
          if (index !== -1) {
            this.pedidosHistorial[index] = pedidoCancelado;
          }
          
          // Si el pedido está abierto en el modal, actualizarlo también
          if (this.pedidoSeleccionado && this.pedidoSeleccionado.id === pedidoCancelado.id) {
            this.pedidoSeleccionado = pedidoCancelado;
          }
          
          alert('Pedido cancelado exitosamente');
        },
        error: (err) => {
          alert('Error al cancelar el pedido: ' + (err.error?.message || err.message));
          console.error('Error canceling order:', err);
        }
      });
    }
  }
} 