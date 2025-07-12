import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Platillo } from '../platillos/platillos';
import { Mesa } from '../mesas/mesas';
// import { Reserva } from '../reservas/reservas'; // Puedes definir esta interfaz si la necesitas

@Injectable({ providedIn: 'root' })
export class ReportesService {
  private apiUrl = 'http://localhost:8080/api/reportes';

  constructor(private http: HttpClient) {}

  getReservasPorFecha(fecha: string): Observable<any[]> { // Cambia 'any' por 'Reserva' si defines la interfaz
    return this.http.get<any[]>(`${this.apiUrl}/reservas-por-fecha?fecha=${fecha}`);
  }

  getPlatillosMasPedidos(): Observable<Platillo[]> {
    return this.http.get<Platillo[]>(`${this.apiUrl}/platillos-mas-pedidos`);
  }

  getOcupacionMesas(): Observable<Mesa[]> {
    return this.http.get<Mesa[]>(`${this.apiUrl}/ocupacion-mesas`);
  }
}
