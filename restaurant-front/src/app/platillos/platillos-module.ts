import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PlatillosListComponent } from './platillos-list/platillos-list';

@NgModule({
  imports: [
    PlatillosListComponent,
    RouterModule.forChild([
      { path: '', component: PlatillosListComponent }
    ])
  ]
})
export class PlatillosModule {}
