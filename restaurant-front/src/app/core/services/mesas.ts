import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Mesa {
  id?: number;
  numeroMesa: number;
  capacidad: number;
  estado: string;
  descripcion?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MesasService {
  private apiUrl = 'http://localhost:8080/api/mesas';

  constructor(private http: HttpClient) { }

  // Obtener todas las mesas
  getMesas(): Observable<Mesa[]> {
    return this.http.get<Mesa[]>(this.apiUrl);
  }

  // Obtener una mesa por ID
  getMesa(id: number): Observable<Mesa> {
    return this.http.get<Mesa>(`${this.apiUrl}/${id}`);
  }

  // Crear una nueva mesa
  createMesa(mesa: Mesa): Observable<Mesa> {
    return this.http.post<Mesa>(this.apiUrl, mesa);
  }

  // Actualizar una mesa
  updateMesa(id: number, mesa: Mesa): Observable<Mesa> {
    return this.http.put<Mesa>(`${this.apiUrl}/${id}`, mesa);
  }

  // Eliminar una mesa
  deleteMesa(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Obtener mesas por estado
  getMesasByEstado(estado: string): Observable<Mesa[]> {
    return this.http.get<Mesa[]>(`${this.apiUrl}/estado/${estado}`);
  }
}
