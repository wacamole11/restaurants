import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlatillosService, Platillo } from '../../core/services/platillos';
import { Spinner } from '../../shared/spinner/spinner';

@Component({
  selector: 'app-platillos-gestion',
  standalone: true,
  imports: [CommonModule, FormsModule, Spinner],
  templateUrl: './platillos-gestion.html',
  styleUrl: './platillos-gestion.scss'
})
export class PlatillosGestionComponent implements OnInit {
  platillos: Platillo[] = [];
  loading = false;
  error = '';
  showModal = false;
  editingPlatillo: Platillo | null = null;
  saving = false;

  // Modal de detalles
  showDetailsModal = false;
  detailsPlatillo: Platillo | null = null;

  // Filtros y búsqueda
  searchTerm: string = '';
  filtroCategoria: 'todos' | 'Entrada' | 'Plato Fuerte' | 'Postre' | 'Bebida' = 'todos';
  filtroDisponibilidad: 'todos' | 'disponible' | 'no-disponible' = 'todos';

  // Mensajes de alerta
  alertMessage: string = '';
  alertType: 'success' | 'error' = 'success';
  showAlert: boolean = false;

  // Modal de confirmación de eliminación
  showDeleteModal: boolean = false;
  platilloAEliminar: Platillo | null = null;

  categorias = ['Entrada', 'Plato Fuerte', 'Postre', 'Bebida'];

  formPlatillo: Platillo = {
    nombre: '',
    descripcion: '',
    precio: 0,
    categoria: '',
    disponible: true,
    // imagen: '' // Si quieres agregar campo imagen
  };

  constructor(private platillosService: PlatillosService) {}

  ngOnInit() {
    this.loadPlatillos();
  }

  get platillosFiltrados(): Platillo[] {
    let filtrados = this.platillos;
    // Filtro por búsqueda
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.trim().toLowerCase();
      filtrados = filtrados.filter(p =>
        p.nombre.toLowerCase().includes(term) ||
        (p.descripcion && p.descripcion.toLowerCase().includes(term))
      );
    }
    // Filtro por categoría
    if (this.filtroCategoria !== 'todos') {
      filtrados = filtrados.filter(p => p.categoria === this.filtroCategoria);
    }
    // Filtro por disponibilidad
    if (this.filtroDisponibilidad !== 'todos') {
      filtrados = filtrados.filter(p => 
        this.filtroDisponibilidad === 'disponible' ? p.disponible : !p.disponible
      );
    }
    return filtrados;
  }

  loadPlatillos() {
    this.loading = true;
    this.error = '';
    this.platillosService.getPlatillos().subscribe({
      next: (platillos) => {
        this.platillos = platillos;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los platillos: ' + err.message;
        this.loading = false;
      }
    });
  }

  openCreateModal() {
    this.editingPlatillo = null;
    this.formPlatillo = {
      nombre: '',
      descripcion: '',
      precio: 0,
      categoria: '',
      disponible: true,
    };
    this.showModal = true;
  }

  editPlatillo(platillo: Platillo) {
    this.editingPlatillo = platillo;
    this.formPlatillo = { ...platillo };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.saving = false;
    this.editingPlatillo = null;
  }

  savePlatillo() {
    this.saving = true;
    if (this.editingPlatillo) {
      this.platillosService.updatePlatillo(this.editingPlatillo.id!, this.formPlatillo).subscribe({
        next: (platilloActualizado) => {
          const idx = this.platillos.findIndex(p => p.id === platilloActualizado.id);
          if (idx !== -1) this.platillos[idx] = platilloActualizado;
          this.closeModal();
          this.showSuccess('Platillo actualizado correctamente.');
        },
        error: (err) => {
          this.showError('Error al actualizar platillo: ' + (err.error?.message || err.message));
          this.saving = false;
        }
      });
    } else {
      this.platillosService.createPlatillo(this.formPlatillo).subscribe({
        next: (nuevoPlatillo) => {
          this.platillos.push(nuevoPlatillo);
          this.closeModal();
          this.showSuccess('Platillo creado correctamente.');
        },
        error: (err) => {
          this.showError('Error al crear platillo: ' + (err.error?.message || err.message));
          this.saving = false;
        }
      });
    }
  }

  deletePlatillo(platilloId: number) {
    const platillo = this.platillos.find(p => p.id === platilloId);
    if (platillo) {
      this.openDeleteModal(platillo);
    }
  }

  openDeleteModal(platillo: Platillo) {
    this.platilloAEliminar = platillo;
    this.showDeleteModal = true;
    setTimeout(() => {
      const btn = document.getElementById('btn-confirm-delete-platillo');
      if (btn) btn.focus();
    }, 100);
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.platilloAEliminar = null;
  }

  confirmDeletePlatillo() {
    if (!this.platilloAEliminar) return;
    this.platillosService.deletePlatillo(this.platilloAEliminar.id!).subscribe({
      next: () => {
        this.platillos = this.platillos.filter(p => p.id !== this.platilloAEliminar!.id);
        this.showSuccess('Platillo eliminado correctamente.');
        this.closeDeleteModal();
      },
      error: (err) => {
        this.showError('Error al eliminar platillo: ' + (err.error?.message || err.message));
        this.closeDeleteModal();
      }
    });
  }

  viewPlatillo(platillo: Platillo) {
    this.detailsPlatillo = { ...platillo };
    this.showDetailsModal = true;
  }

  closeDetailsModal() {
    this.showDetailsModal = false;
    this.detailsPlatillo = null;
  }

  // Métodos para estadísticas
  getTotalPlatillos(): number {
    return this.platillos.length;
  }

  getDisponibles(): number {
    return this.platillos.filter(p => p.disponible).length;
  }

  getNoDisponibles(): number {
    return this.platillos.filter(p => !p.disponible).length;
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
