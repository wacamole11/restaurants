import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidosService, Pedido } from '../pedidos';
import { Spinner } from '../../shared/spinner/spinner';

@Component({
  selector: 'app-pedidos-list',
  standalone: true,
  imports: [CommonModule, Spinner],
  templateUrl: './pedidos-list.html',
  styleUrl: './pedidos-list.scss'
})
export class PedidosListComponent implements OnInit {
  pedidos: Pedido[] = [];
  loading = true;
  error = '';

  constructor(private pedidosService: PedidosService) {}

  ngOnInit() {
    this.pedidosService.getPedidos().subscribe({
      next: pedidos => {
        // Filtrar pedidos cancelados - solo mostrar pedidos activos
        this.pedidos = pedidos.filter(pedido => pedido.estado !== 'cancelado');
        this.loading = false;
        console.log('Pedidos cargados (sin cancelados):', this.pedidos);
        console.log('Pedidos cancelados filtrados:', pedidos.filter(p => p.estado === 'cancelado'));
      },
      error: err => {
        this.error = 'No se pudieron cargar los pedidos';
        this.loading = false;
      }
    });
  }

  // Métodos para estadísticas
  getPedidosByEstado(estado: string): Pedido[] {
    return this.pedidos.filter(pedido => pedido.estado === estado);
  }

  // Métodos para estilos
  getEstadoClass(estado: string): string {
    switch (estado?.toLowerCase()) {
      case 'en_proceso':
        return 'estado-proceso';
      case 'cancelado':
        return 'estado-cancelado';
      case 'completado':
        return 'estado-completado';
      case 'servido':
        return 'estado-servido';
      case 'pagado':
        return 'estado-pagado';
      default:
        return 'estado-default';
    }
  }

  getEstadoText(estado: string): string {
    switch (estado?.toLowerCase()) {
      case 'en_proceso':
        return 'En Proceso';
      case 'cancelado':
        return 'Cancelado';
      case 'completado':
        return 'Completado';
      case 'servido':
        return 'Servido';
      case 'pagado':
        return 'Pagado';
      default:
        return estado || 'Desconocido';
    }
  }
}
