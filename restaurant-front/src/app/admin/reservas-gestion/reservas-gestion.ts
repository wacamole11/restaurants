import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Spinner } from '../../shared/spinner/spinner';
import { ReservasService, Reserva } from '../../reservas/reservas';
import { UsuariosService, Usuario } from '../../usuarios/usuarios';
import { MesasService, Mesa } from '../../mesas/mesas';
import { PedidosService, Pedido } from '../../pedidos/pedidos';

@Component({
  selector: 'app-reservas-gestion',
  standalone: true,
  imports: [CommonModule, FormsModule, Spinner],
  templateUrl: './reservas-gestion.html',
  styleUrl: './reservas-gestion.scss'
})
export class ReservasGestionComponent implements OnInit {
  reservas: Reserva[] = [];
  loading = false;
  error = '';

  // Modal para nueva reserva
  showCreateModal = false;
  creating = false;
  createError = '';
  createSuccess = '';

  // Modal para editar reserva
  showEditModal = false;
  editing = false;
  editError = '';
  editSuccess = '';
  reservaEditando: Reserva | null = null;

  // Modal para ver reserva
  showViewModal = false;
  reservaVer: Reserva | null = null;

  // Modal para ver pedidos de la reserva
  showPedidosModal = false;
  pedidosReserva: Pedido[] = [];
  loadingPedidos = false;
  cancelandoPedido = false;

  // Filtros y búsqueda
  searchTerm: string = '';
  filtroEstado: 'todos' | 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA' = 'todos';
  filtroFecha: string = '';

  // Mensajes de alerta
  alertMessage: string = '';
  alertType: 'success' | 'error' = 'success';
  showAlert: boolean = false;

  // Modal de confirmación de cancelación
  showCancelModal: boolean = false;
  reservaACancelar: Reserva | null = null;

  // Datos para formularios
  usuarios: Usuario[] = [];
  mesas: Mesa[] = [];
  formReserva: any = {
    usuarioId: '',
    mesaId: '',
    fechaReserva: '',
    numPersonas: 1
  };

  constructor(
    private reservasService: ReservasService,
    private usuariosService: UsuariosService,
    private mesasService: MesasService,
    private pedidosService: PedidosService
  ) {}

  ngOnInit() {
    this.loadReservas();
    this.loadUsuarios();
    this.loadMesas();
  }

  get reservasFiltradas(): Reserva[] {
    let filtradas = this.reservas;
    // Filtro por búsqueda
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.trim().toLowerCase();
      filtradas = filtradas.filter(r =>
        (r.usuarioNombre && r.usuarioNombre.toLowerCase().includes(term)) ||
        (r.usuarioEmail && r.usuarioEmail.toLowerCase().includes(term)) ||
        (r.mesaNombre && r.mesaNombre.toLowerCase().includes(term))
      );
    }
    // Filtro por estado
    if (this.filtroEstado !== 'todos') {
      filtradas = filtradas.filter(r => r.estado === this.filtroEstado);
    }
    // Filtro por fecha
    if (this.filtroFecha) {
      const fechaFiltro = new Date(this.filtroFecha);
      filtradas = filtradas.filter(r => {
        const fechaReserva = new Date(r.fechaReserva);
        return fechaReserva.toDateString() === fechaFiltro.toDateString();
      });
    }
    return filtradas;
  }

  loadReservas() {
    this.loading = true;
    this.error = '';
    this.reservasService.getReservas().subscribe({
      next: (reservas) => {
        this.reservas = reservas;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar las reservas: ' + err.message;
        this.loading = false;
      }
    });
  }

  loadUsuarios() {
    this.usuariosService.getUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
      }
    });
  }

  loadMesas() {
    this.mesasService.getMesas().subscribe({
      next: (mesas) => {
        this.mesas = mesas;
      },
      error: (err) => {
        console.error('Error al cargar mesas:', err);
      }
    });
  }

  openCreateModal() {
    this.showCreateModal = true;
    this.createError = '';
    this.createSuccess = '';
    this.formReserva = {
      usuarioId: '',
      mesaId: '',
      fechaReserva: '',
      numPersonas: 1
    };
  }

  closeCreateModal() {
    this.showCreateModal = false;
    this.creating = false;
    this.createError = '';
    this.createSuccess = '';
  }

  createReserva() {
    this.creating = true;
    this.createError = '';
    this.createSuccess = '';

    const nuevaReserva = {
      usuarioId: this.formReserva.usuarioId,
      mesaId: this.formReserva.mesaId,
      fechaReserva: this.formReserva.fechaReserva,
      numPersonas: this.formReserva.numPersonas
    };

    this.reservasService.createReserva(nuevaReserva).subscribe({
      next: (reserva) => {
        this.reservas.push(reserva);
        this.closeCreateModal();
        this.showSuccess('Reserva creada correctamente.');
      },
      error: (err) => {
        this.createError = 'Error al crear la reserva: ' + (err.error?.message || err.message);
        this.creating = false;
      }
    });
  }

  openEditModal(reserva: Reserva) {
    this.reservaEditando = reserva;
    this.formReserva = {
      usuarioId: reserva.usuarioId,
      mesaId: reserva.mesaId,
      fechaReserva: reserva.fechaReserva,
      numPersonas: reserva.numPersonas
    };
    this.showEditModal = true;
    this.editError = '';
    this.editSuccess = '';
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editing = false;
    this.reservaEditando = null;
    this.editError = '';
    this.editSuccess = '';
  }

  updateReserva() {
    if (!this.reservaEditando) return;

    this.editing = true;
    this.editError = '';
    this.editSuccess = '';

    const reservaActualizada = {
      usuarioId: this.formReserva.usuarioId,
      mesaId: this.formReserva.mesaId,
      fechaReserva: this.formReserva.fechaReserva,
      numPersonas: this.formReserva.numPersonas
    };

    // TODO: Implementar método updateReserva en ReservasService
    // this.reservasService.updateReserva(this.reservaEditando.id, reservaActualizada).subscribe({
    //   next: (reserva: Reserva) => {
    //     const idx = this.reservas.findIndex(r => r.id === reserva.id);
    //     if (idx !== -1) this.reservas[idx] = reserva;
    //     this.closeEditModal();
    //     this.showSuccess('Reserva actualizada correctamente.');
    //   },
    //   error: (err: any) => {
    //     this.editError = 'Error al actualizar la reserva: ' + (err.error?.message || err.message);
    //     this.editing = false;
    //   }
    // });

    // Por ahora, actualizamos localmente
    const idx = this.reservas.findIndex(r => r.id === this.reservaEditando!.id);
    if (idx !== -1) {
      this.reservas[idx] = { ...this.reservas[idx], ...reservaActualizada };
    }
    this.closeEditModal();
    this.showSuccess('Reserva actualizada correctamente.');
  }

  openViewModal(reserva: Reserva) {
    this.reservaVer = { ...reserva };
    this.showViewModal = true;
  }

  closeViewModal() {
    this.showViewModal = false;
    this.reservaVer = null;
  }

  openPedidosModal(reserva: Reserva) {
    this.reservaVer = { ...reserva };
    this.showPedidosModal = true;
    this.loadPedidosReserva(reserva.id);
  }

  closePedidosModal() {
    this.showPedidosModal = false;
    this.pedidosReserva = [];
    this.loadingPedidos = false;
    this.cancelandoPedido = false;
  }

  closeAllModals() {
    this.closeViewModal();
    this.closePedidosModal();
  }

  loadPedidosReserva(reservaId: number) {
    this.loadingPedidos = true;
    // TODO: Implementar método getPedidosByReserva en PedidosService
    // this.pedidosService.getPedidosByReserva(reservaId).subscribe({
    //   next: (pedidos: Pedido[]) => {
    //     this.pedidosReserva = pedidos;
    //     this.loadingPedidos = false;
    //   },
    //   error: (err: any) => {
    //     console.error('Error al cargar pedidos:', err);
    //     this.loadingPedidos = false;
    //   }
    // });

    // Por ahora, filtramos los pedidos existentes
    this.pedidosService.getPedidos().subscribe({
      next: (pedidos: Pedido[]) => {
        this.pedidosReserva = pedidos.filter(p => p.reservaId === reservaId);
        this.loadingPedidos = false;
      },
      error: (err: any) => {
        console.error('Error al cargar pedidos:', err);
        this.loadingPedidos = false;
      }
    });
  }

  cancelarReserva(reserva: Reserva) {
    this.openCancelModal(reserva);
  }

  openCancelModal(reserva: Reserva) {
    this.reservaACancelar = reserva;
    this.showCancelModal = true;
    setTimeout(() => {
      const btn = document.getElementById('btn-confirm-cancel');
      if (btn) btn.focus();
    }, 100);
  }

  closeCancelModal() {
    this.showCancelModal = false;
    this.reservaACancelar = null;
  }

  confirmCancelarReserva() {
    if (!this.reservaACancelar) return;

    this.reservasService.cancelarReserva(this.reservaACancelar.id).subscribe({
      next: (reservaCancelada) => {
        const idx = this.reservas.findIndex(r => r.id === reservaCancelada.id);
        if (idx !== -1) this.reservas[idx] = reservaCancelada;
        this.showSuccess('Reserva cancelada correctamente.');
        this.closeCancelModal();
      },
      error: (err) => {
        this.showError('Error al cancelar la reserva: ' + (err.error?.message || err.message));
        this.closeCancelModal();
      }
    });
  }

  cancelarPedido(pedido: Pedido) {
    this.cancelandoPedido = true;
    // TODO: Implementar método cancelarPedido en PedidosService
    // this.pedidosService.cancelarPedido(pedido.id).subscribe({
    //   next: (pedidoCancelado: Pedido) => {
    //     const idx = this.pedidosReserva.findIndex(p => p.id === pedidoCancelado.id);
    //     if (idx !== -1) this.pedidosReserva[idx] = pedidoCancelado;
    //     this.cancelandoPedido = false;
    //     this.showSuccess('Pedido cancelado correctamente.');
    //   },
    //   error: (err: any) => {
    //     this.showError('Error al cancelar el pedido: ' + (err.error?.message || err.message));
    //     this.cancelandoPedido = false;
    //   }
    // });

    // Por ahora, actualizamos localmente
    const pedidoActualizado = {
      ...pedido,
      estado: 'cancelado',
      fechaCierre: new Date().toISOString()
    };
    
    this.pedidosService.updatePedido(pedido.id, pedidoActualizado).subscribe({
      next: (pedidoCancelado: Pedido) => {
        const idx = this.pedidosReserva.findIndex(p => p.id === pedidoCancelado.id);
        if (idx !== -1) this.pedidosReserva[idx] = pedidoCancelado;
        this.cancelandoPedido = false;
        this.showSuccess('Pedido cancelado correctamente.');
      },
      error: (err: any) => {
        this.showError('Error al cancelar el pedido: ' + (err.error?.message || err.message));
        this.cancelandoPedido = false;
      }
    });
  }

  getEstadoClass(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'pendiente': return 'estado-pendiente';
      case 'en_preparacion': return 'estado-en-preparacion';
      case 'listo': return 'estado-listo';
      case 'entregado': return 'estado-entregado';
      case 'cancelado': return 'estado-cancelado';
      default: return 'estado-pendiente';
    }
  }

  getEstadoText(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'pendiente': return 'Pendiente';
      case 'en_preparacion': return 'En Preparación';
      case 'listo': return 'Listo';
      case 'entregado': return 'Entregado';
      case 'cancelado': return 'Cancelado';
      default: return estado;
    }
  }

  // Métodos para mensajes de alerta
  showSuccess(msg: string) {
    this.alertType = 'success';
    this.alertMessage = msg;
    this.showAlert = true;
    setTimeout(() => this.showAlert = false, 3500);
  }

  showError(msg: string) {
    this.alertType = 'error';
    this.alertMessage = msg;
    this.showAlert = true;
    setTimeout(() => this.showAlert = false, 5000);
  }
}
