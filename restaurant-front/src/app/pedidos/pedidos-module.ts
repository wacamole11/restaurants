import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PedidosListComponent } from './pedidos-list/pedidos-list';

@NgModule({
  imports: [
    PedidosListComponent,
    RouterModule.forChild([
      { path: '', component: PedidosListComponent }
    ])
  ]
})
export class PedidosModule {}
