import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MesasService, Mesa } from '../../core/services/mesas';
import { HttpClient } from '@angular/common/http';
import { Spinner } from '../../shared/spinner/spinner';

interface Reserva {
  id: number;
  fecha: string;
  hora: string;
  nombreCliente: string;
  telefono: string;
  cantidadPersonas: number;
  estado: string;
}

@Component({
  selector: 'app-mesas-gestion',
  standalone: true,
  imports: [CommonModule, FormsModule, Spinner],
  templateUrl: './mesas-gestion.html',
  styleUrl: './mesas-gestion.scss'
})
export class MesasGestionComponent implements OnInit {
  mesas: Mesa[] = [];
  loading = false;
  error = '';
  showModal = false;
  editingMesa: Mesa | null = null;
  saving = false;

  // Modal de detalles
  showDetailsModal = false;
  detailsMesa: Mesa | null = null;
  reservaMesa: Reserva | null = null;
  loadingReserva = false;
  reservaError = '';

  // Filtros y búsqueda
  searchTerm: string = '';
  filtroEstado: 'todos' | 'DISPONIBLE' | 'OCUPADA' | 'RESERVADA' | 'MANTENIMIENTO' = 'todos';

  // Mensajes de alerta
  alertMessage: string = '';
  alertType: 'success' | 'error' = 'success';
  showAlert: boolean = false;

  // Modal de confirmación de eliminación
  showDeleteModal: boolean = false;
  mesaAEliminar: Mesa | null = null;

  formMesa: Mesa = {
    numeroMesa: 0,
    capacidad: 0,
    estado: '',
    descripcion: ''
  };

  constructor(private mesasService: MesasService, private http: HttpClient) {}

  ngOnInit() {
    this.loadMesas();
  }

  get mesasFiltradas(): Mesa[] {
    let filtradas = this.mesas;
    // Filtro por búsqueda
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.trim().toLowerCase();
      filtradas = filtradas.filter(m =>
        m.numeroMesa.toString().includes(term) ||
        (m.descripcion && m.descripcion.toLowerCase().includes(term))
      );
    }
    // Filtro por estado
    if (this.filtroEstado !== 'todos') {
      filtradas = filtradas.filter(m => m.estado === this.filtroEstado);
    }
    return filtradas;
  }

  loadMesas() {
    this.loading = true;
    this.error = '';
    this.mesasService.getMesas().subscribe({
      next: (mesas) => {
        this.mesas = mesas;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar las mesas: ' + err.message;
        this.loading = false;
      }
    });
  }

  openCreateModal() {
    this.editingMesa = null;
    this.formMesa = {
      numeroMesa: 0,
      capacidad: 0,
      estado: 'DISPONIBLE',
      descripcion: ''
    };
    this.showModal = true;
  }

  editMesa(mesa: Mesa) {
    this.editingMesa = mesa;
    this.formMesa = { ...mesa };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.saving = false;
    this.editingMesa = null;
  }

  saveMesa() {
    this.saving = true;
    if (this.editingMesa) {
      this.mesasService.updateMesa(this.editingMesa.id!, this.formMesa).subscribe({
        next: (mesaActualizada) => {
          const idx = this.mesas.findIndex(m => m.id === mesaActualizada.id);
          if (idx !== -1) this.mesas[idx] = mesaActualizada;
          this.closeModal();
          this.showSuccess('Mesa actualizada correctamente.');
        },
        error: (err) => {
          this.showError('Error al actualizar mesa: ' + (err.error?.message || err.message));
          this.saving = false;
        }
      });
    } else {
      this.mesasService.createMesa(this.formMesa).subscribe({
        next: (nuevaMesa) => {
          this.mesas.push(nuevaMesa);
          this.closeModal();
          this.showSuccess('Mesa creada correctamente.');
        },
        error: (err) => {
          this.showError('Error al crear mesa: ' + (err.error?.message || err.message));
          this.saving = false;
        }
      });
    }
  }

  deleteMesa(mesaId: number) {
    const mesa = this.mesas.find(m => m.id === mesaId);
    if (mesa) {
      this.openDeleteModal(mesa);
    }
  }

  openDeleteModal(mesa: Mesa) {
    this.mesaAEliminar = mesa;
    this.showDeleteModal = true;
    setTimeout(() => {
      const btn = document.getElementById('btn-confirm-delete-mesa');
      if (btn) btn.focus();
    }, 100);
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.mesaAEliminar = null;
  }

  confirmDeleteMesa() {
    if (!this.mesaAEliminar) return;
    this.mesasService.deleteMesa(this.mesaAEliminar.id!).subscribe({
      next: () => {
        this.mesas = this.mesas.filter(m => m.id !== this.mesaAEliminar!.id);
        this.showSuccess('Mesa eliminada correctamente.');
        this.closeDeleteModal();
      },
      error: (err) => {
        this.showError('Error al eliminar mesa: ' + (err.error?.message || err.message));
        this.closeDeleteModal();
      }
    });
  }

  viewMesa(mesa: Mesa) {
    this.detailsMesa = { ...mesa };
    this.showDetailsModal = true;
    
    // Si la mesa está reservada, cargar datos de la reserva
    if (mesa.estado === 'RESERVADA') {
      this.loadingReserva = true;
      this.reservaError = '';
      // Aquí deberías hacer la llamada al servicio para obtener la reserva
      // Por ahora lo dejamos como placeholder
      setTimeout(() => {
        this.loadingReserva = false;
        this.reservaError = 'No se pudo cargar la información de la reserva';
      }, 1000);
    }
  }

  closeDetailsModal() {
    this.showDetailsModal = false;
    this.detailsMesa = null;
    this.reservaMesa = null;
    this.loadingReserva = false;
    this.reservaError = '';
  }

  // Métodos para estadísticas
  getAvailableMesas(): number {
    return this.mesas.filter(m => m.estado === 'DISPONIBLE').length;
  }

  getOccupiedMesas(): number {
    return this.mesas.filter(m => m.estado === 'OCUPADA').length;
  }

  getReservedMesas(): number {
    return this.mesas.filter(m => m.estado === 'RESERVADA').length;
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
