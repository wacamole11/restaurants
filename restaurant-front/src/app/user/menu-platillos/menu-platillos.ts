import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlatillosService, Platillo } from '../../core/services/platillos';

@Component({
  selector: 'app-menu-platillos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-platillos.html',
  styleUrl: './menu-platillos.scss'
})
export class MenuPlatillosComponent implements OnInit {
  platillos: Platillo[] = [];
  loading = false;
  error = '';

  constructor(private platillosService: PlatillosService) {}

  ngOnInit() {
    this.cargarPlatillos();
  }

  cargarPlatillos() {
    this.loading = true;
    this.error = '';
    this.platillosService.getPlatillos().subscribe({
      next: (platillos) => {
        this.platillos = platillos.filter(p => p.disponible);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'No se pudieron cargar los platillos.';
        this.loading = false;
      }
    });
  }
}
