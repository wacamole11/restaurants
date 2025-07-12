import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Interfaz que representa un platillo del restaurante
 */
export interface Platillo {
  id?: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  categoria: string;
  disponible: boolean;
}

/**
 * Servicio para gestionar platillos (CRUD)
 */
@Injectable({ providedIn: 'root' })
export class PlatillosService {
  private apiUrl = 'http://localhost:8080/api/platillos';

  constructor(private http: HttpClient) {}

  /** Obtener todos los platillos */
  getPlatillos(): Observable<Platillo[]> {
    return this.http.get<Platillo[]>(this.apiUrl);
  }

  /** Obtener un platillo por ID */
  getPlatillo(id: number): Observable<Platillo> {
    return this.http.get<Platillo>(`${this.apiUrl}/${id}`);
  }

  /** Crear un nuevo platillo */
  createPlatillo(platillo: Platillo): Observable<Platillo> {
    return this.http.post<Platillo>(this.apiUrl, platillo);
  }

  /** Actualizar un platillo */
  updatePlatillo(id: number, platillo: Platillo): Observable<Platillo> {
    return this.http.put<Platillo>(`${this.apiUrl}/${id}`, platillo);
  }

  /** Eliminar un platillo */
  deletePlatillo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
