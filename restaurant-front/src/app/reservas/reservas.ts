import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mesa } from '../mesas/mesas';
import { Usuario } from '../auth/auth';

export interface Reserva {
  id: number;
  fechaReserva: string;
  numPersonas: number;
  estado: string;
  fechaCreacion: string;
  // Datos del usuario (solo información básica)
  usuarioId: number;
  usuarioNombre: string;
  usuarioEmail: string;
  // Datos de la mesa (solo información básica)
  mesaId: number;
  mesaNombre: string;
  mesaCapacidad: number;
  canceladaPor?: string; // USUARIO o ADMIN
}

export interface CreateReservaRequest {
  fechaReserva: string;
  numPersonas: number;
  usuarioId: number;
  mesaId: number;
}

@Injectable({ providedIn: 'root' })
export class ReservasService {
  private apiUrl = 'http://localhost:8080/api/reservas';

  constructor(private http: HttpClient) {}

  getReservas(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(this.apiUrl);
  }

  getReservasByUsuario(usuarioId: number): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  createReserva(reserva: CreateReservaRequest): Observable<Reserva> {
    return this.http.post<Reserva>(this.apiUrl, reserva);
  }

  cancelarReserva(id: number, canceladaPor: string = 'USUARIO'): Observable<Reserva> {
    return this.http.put<Reserva>(`${this.apiUrl}/${id}/cancelar`, { canceladaPor });
  }
}
