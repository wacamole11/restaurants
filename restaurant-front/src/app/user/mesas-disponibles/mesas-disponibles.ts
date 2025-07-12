import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MesasService, Mesa } from '../../mesas/mesas';
import { ReservasService, CreateReservaRequest } from '../../reservas/reservas';
import { FormsModule } from '@angular/forms';
import { AuthService, Usuario } from '../../auth/auth';

@Component({
  selector: 'app-mesas-disponibles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mesas-disponibles.html',
  styleUrl: './mesas-disponibles.scss'
})
export class MesasDisponiblesComponent implements OnInit {
  mesasDisponibles: Mesa[] = [];
  loading = false;
  error = '';

  // Modal reserva
  showModal = false;
  mesaSeleccionada: Mesa | null = null;
  fechaSeleccionada = '';
  horaSeleccionada = '';
  numPersonas = 1;
  reservando = false; 
  reservaError = '';
  reservaSuccess = '';
  minFecha = '';
  minHora = '08:00';
  maxHora = '15:00';
  horaValida = true;
  horasPermitidas: string[] = [];

  // Usuario actual (obtenido de AuthService)
  usuarioActual: Usuario | null = null;

  constructor(
    private mesasService: MesasService,
    private reservasService: ReservasService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.usuarioActual = this.authService.getCurrentUser();
    this.cargarMesasDisponibles();
    this.setMinFecha();
    this.generarHorasPermitidas();
  }

  generarHorasPermitidas() {
    this.horasPermitidas = [];
    for (let h = 8; h <= 15; h++) {
      for (let m = 0; m < 60; m += 15) {
        if (h === 15 && m > 0) break;
        const hora = h.toString().padStart(2, '0');
        const min = m.toString().padStart(2, '0');
        this.horasPermitidas.push(`${hora}:${min}`);
      }
    }
  }

  setMinFecha() {
    const hoy = new Date();
    hoy.setSeconds(0, 0);
    this.minFecha = hoy.toISOString().slice(0, 10);
  }

  onFechaChange() {
    // Opcional: podrías resetear la hora si la fecha cambia
  }

  onHoraChange() {
    // Ya no es necesaria la validación, solo se pueden elegir horas válidas
  }

  onFechaHoraChange() {
    // Ya no es necesaria la validación, solo se pueden elegir horas válidas
  }

  get fechaReservaCompleta(): string {
    if (!this.fechaSeleccionada || !this.horaSeleccionada) return '';
    return `${this.fechaSeleccionada}T${this.horaSeleccionada}`;
  }

  cargarMesasDisponibles() {
    this.loading = true;
    this.error = '';
    this.mesasService.getMesas().subscribe({
      next: (mesas) => {
        this.mesasDisponibles = mesas.filter(m => m.estado === 'DISPONIBLE');
        this.loading = false;
      },
      error: (err) => {
        this.error = 'No se pudieron cargar las mesas disponibles.';
        this.loading = false;
      }
    });
  }

  reservarMesa(mesa: Mesa) {
    this.mesaSeleccionada = mesa;
    this.fechaSeleccionada = '';
    this.horaSeleccionada = '';
    this.numPersonas = 1;
    this.reservaError = '';
    this.reservaSuccess = '';
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.mesaSeleccionada = null;
    this.reservando = false;
    this.reservaError = '';
    this.reservaSuccess = '';
  }

  confirmarReserva() {
    if (!this.fechaSeleccionada || !this.horaSeleccionada || !this.numPersonas || !this.mesaSeleccionada) {
      this.reservaError = 'Completa todos los campos.';
      return;
    }
    if (!this.usuarioActual) {
      this.reservaError = 'No se pudo obtener el usuario autenticado.';
      return;
    }
    const fechaReserva = this.fechaReservaCompleta;
    this.reservando = true;
    this.reservaError = '';
    this.reservaSuccess = '';
    this.reservasService.createReserva({
      fechaReserva,
      numPersonas: this.numPersonas,
      usuarioId: this.usuarioActual.id,
      mesaId: this.mesaSeleccionada.id
    }).subscribe({
      next: () => {
        this.reservaSuccess = '¡Reserva realizada con éxito!';
        this.reservando = false;
        setTimeout(() => this.closeModal(), 1200);
        this.cargarMesasDisponibles();
      },
      error: (err) => {
        this.reservaError = 'No se pudo realizar la reserva.';
        this.reservando = false;
      }
    });
  }
}
