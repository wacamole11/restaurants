import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Spinner } from '../../shared/spinner/spinner';
import { UsuariosService, Usuario } from '../../usuarios/usuarios';
import { FormsModule } from '@angular/forms';
import { ReservasService } from '../../reservas/reservas';
import { PedidosService } from '../../pedidos/pedidos';

@Component({
  selector: 'app-usuarios-gestion',
  standalone: true,
  imports: [CommonModule, Spinner, FormsModule],
  templateUrl: './usuarios-gestion.html',
  styleUrl: './usuarios-gestion.scss'
})
export class UsuariosGestionComponent implements OnInit {
  usuarios: Usuario[] = [];
  loading = false;
  error = '';

  // Modal alta/edición usuario
  showModal = false;
  saving = false;
  editando: Usuario | null = null;
  formUsuario: Partial<Usuario> = {
    nombre: '',
    apellido: '',
    username: '',
    email: '',
    telefono: '',
    enabled: true,
    roles: [],
    password: '',
  };
  rolesDisponibles = ['ADMIN', 'USER'];

  // Modal ver usuario
  showViewModal = false;
  usuarioVer: Usuario | null = null;

  // Filtros y búsqueda
  searchTerm: string = '';
  filtroEstado: 'todos' | 'activo' | 'inactivo' = 'todos';
  filtroRol: 'todos' | 'ADMIN' | 'USER' = 'todos';

  // Mensajes de alerta
  alertMessage: string = '';
  alertType: 'success' | 'error' = 'success';
  showAlert: boolean = false;

  // Modal de confirmación de eliminación
  showDeleteModal: boolean = false;
  usuarioAEliminar: Usuario | null = null;

  get usuariosFiltrados(): Usuario[] {
    let filtrados = this.usuarios;
    // Filtro por búsqueda
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.trim().toLowerCase();
      filtrados = filtrados.filter(u =>
        (u.nombre && u.nombre.toLowerCase().includes(term)) ||
        (u.apellido && u.apellido.toLowerCase().includes(term)) ||
        (u.username && u.username.toLowerCase().includes(term)) ||
        (u.email && u.email.toLowerCase().includes(term))
      );
    }
    // Filtro por estado
    if (this.filtroEstado !== 'todos') {
      filtrados = filtrados.filter(u =>
        this.filtroEstado === 'activo' ? u.enabled : !u.enabled
      );
    }
    // Filtro por rol
    if (this.filtroRol !== 'todos') {
      filtrados = filtrados.filter(u =>
        (u.roles || []).some((r: any) => (typeof r === 'string' ? r : r.nombre) === this.filtroRol)
      );
    }
    return filtrados;
  }

  constructor(private usuariosService: UsuariosService,
              private reservasService: ReservasService,
              private pedidosService: PedidosService) {}

  ngOnInit() {
    this.loadUsuarios();
  }

  loadUsuarios() {
    this.loading = true;
    this.error = '';
    this.usuariosService.getUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los usuarios: ' + err.message;
        this.loading = false;
      }
    });
  }

  openCreateModal() {
    this.editando = null;
    this.formUsuario = {
      nombre: '',
      apellido: '',
      username: '',
      email: '',
      telefono: '',
      enabled: true,
      roles: [],
    };
    this.showModal = true;
  }

  openEditModal(usuario: Usuario) {
    this.editando = usuario;
    this.formUsuario = { ...usuario, roles: [...usuario.roles.map((r: any) => r.nombre || r)] };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.saving = false;
    this.editando = null;
  }

  saveUsuario() {
    this.saving = true;
    if (this.editando) {
      // Edición real
      const usuarioEdit = {
        ...this.formUsuario,
        roles: (this.formUsuario.roles || []).map(nombre => ({ nombre })),
        enabled: this.formUsuario.enabled ?? true,
      };
      if (!usuarioEdit.password) delete usuarioEdit.password; // No cambiar contraseña si está vacío
      
      this.usuariosService.updateUsuario(this.editando.id, usuarioEdit).subscribe({
        next: (usuarioActualizado) => {
          const idx = this.usuarios.findIndex(u => u.id === usuarioActualizado.id);
          if (idx !== -1) this.usuarios[idx] = usuarioActualizado;
          this.closeModal();
        },
        error: (err) => {
          this.error = 'Error al actualizar usuario: ' + (err.error?.message || err.message);
          this.saving = false;
        }
      });
    } else {
      // Alta real
      this.usuariosService.createUsuario({
        ...this.formUsuario,
        roles: (this.formUsuario.roles || []).map(nombre => ({ nombre })),
        enabled: this.formUsuario.enabled ?? true,
      }).subscribe({
        next: (nuevoUsuario) => {
          this.usuarios.push(nuevoUsuario);
          this.closeModal();
        },
        error: (err) => {
          this.error = 'Error al crear usuario: ' + (err.error?.message || err.message);
          this.saving = false;
        }
      });
    }
  }

  deleteUsuario(usuario: Usuario) {
    if (confirm('¿Seguro que deseas eliminar este usuario?')) {
      this.usuariosService.deleteUsuario(usuario.id).subscribe({
        next: () => {
          this.usuarios = this.usuarios.filter(u => u.id !== usuario.id);
        },
        error: (err) => {
          this.error = 'Error al eliminar usuario: ' + (err.error?.message || err.message);
        }
      });
    }
  }

  openViewModal(usuario: Usuario) {
    this.usuarioVer = { ...usuario };
    this.showViewModal = true;
    // Consultar cantidad de reservas
    this.reservasService.getReservasByUsuario(usuario.id).subscribe({
      next: (reservas) => {
        this.usuarioVer!.reservasCount = reservas.length;
      },
      error: () => {
        this.usuarioVer!.reservasCount = 0;
      }
    });
    // Consultar cantidad de pedidos
    this.pedidosService.getPedidosByUsuario(usuario.id).subscribe({
      next: (pedidos) => {
        this.usuarioVer!.pedidosCount = pedidos.length;
      },
      error: () => {
        this.usuarioVer!.pedidosCount = 0;
      }
    });
  }

  closeViewModal() {
    this.showViewModal = false;
    this.usuarioVer = null;
  }

  // Método helper para obtener el nombre del rol
  getRolNombre(rol: any): string {
    if (typeof rol === 'string') {
      return rol;
    } else if (rol && typeof rol === 'object' && rol.nombre) {
      return rol.nombre;
    }
    return 'Sin rol';
  }

  // Método helper para obtener todos los roles como string
  getRolesString(roles: any[]): string {
    if (!roles || roles.length === 0) {
      return 'Sin roles';
    }
    return roles.map(rol => this.getRolNombre(rol)).join(', ');
  }

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

  openDeleteModal(usuario: Usuario) {
    this.usuarioAEliminar = usuario;
    this.showDeleteModal = true;
    setTimeout(() => {
      const btn = document.getElementById('btn-confirm-delete');
      if (btn) btn.focus();
    }, 100);
  }
  closeDeleteModal() {
    this.showDeleteModal = false;
    this.usuarioAEliminar = null;
  }
  confirmDeleteUsuario() {
    if (!this.usuarioAEliminar) return;
    this.usuariosService.deleteUsuario(this.usuarioAEliminar.id).subscribe({
      next: () => {
        this.usuarios = this.usuarios.filter(u => u.id !== this.usuarioAEliminar!.id);
        this.showSuccess('Usuario eliminado correctamente.');
        this.closeDeleteModal();
      },
      error: (err) => {
        this.showError('Error al eliminar usuario: ' + (err.error?.message || err.message));
        this.closeDeleteModal();
      }
    });
  }
}
