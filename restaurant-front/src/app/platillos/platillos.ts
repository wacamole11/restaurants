import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Platillo {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  categoria: string;
  disponible: boolean;
}

@Injectable({ providedIn: 'root' })
export class PlatillosService {
  private apiUrl = 'http://localhost:8080/api/platillos';

  constructor(private http: HttpClient) {}

  getPlatillos(): Observable<Platillo[]> {
    return this.http.get<Platillo[]>(this.apiUrl);
  }
}
