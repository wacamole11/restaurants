import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Mesa {
  id: number;
  numeroMesa: string;
  capacidad: number;
  descripcion?: string;
  fotoUrl?: string;
  estado: string;
}

@Injectable({ providedIn: 'root' })
export class MesasService {
  private apiUrl = 'http://localhost:8080/api/mesas';

  constructor(private http: HttpClient) {}

  getMesas(): Observable<Mesa[]> {
    return this.http.get<Mesa[]>(this.apiUrl);
  }
}
