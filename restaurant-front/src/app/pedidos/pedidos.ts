import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mesa } from '../mesas/mesas';
import { Usuario } from '../auth/auth';

export interface Pedido {
  id: number;
  reservaId?: number;
  mesaId?: number;
  mesaNombre?: string;
  mesaCapacidad?: number;
  usuarioId?: number;
  usuarioNombre?: string;
  usuarioEmail?: string;
  total: number;
  estado: string;
  fechaCreacion: string;
  fechaCierre?: string;
  fechaReserva?: string;
  numPersonas?: number;
  estadoReserva?: string;
  reservaMesaNombre?: string;
  horaEntregaProgramada?: string;
  canceladoPorReserva?: boolean;
  detalles?: PedidoDetalle[];
}

export interface PedidoDetalle {
  id?: number;
  platilloId?: number;
  platilloNombre?: string;
  platilloCategoria?: string;
  cantidad: number;
  precioUnitario: number;
}

@Injectable({ providedIn: 'root' })
export class PedidosService {
  private apiUrl = 'http://localhost:8080/api/pedidos';

  constructor(private http: HttpClient) {}

  getPedidos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.apiUrl);
  }

  getPedidosByUsuario(usuarioId: number): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  createPedido(pedido: Partial<Pedido>): Observable<Pedido> {
    return this.http.post<Pedido>(this.apiUrl, pedido);
  }

  updatePedido(id: number, pedido: Partial<Pedido>): Observable<Pedido> {
    return this.http.put<Pedido>(`${this.apiUrl}/${id}`, pedido);
  }

  getPedidoById(id: number): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.apiUrl}/${id}`);
  }
}
