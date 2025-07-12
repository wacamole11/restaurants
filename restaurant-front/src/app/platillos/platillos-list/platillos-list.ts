import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlatillosService, Platillo } from '../platillos';

@Component({
  selector: 'app-platillos-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './platillos-list.html',
  styleUrl: './platillos-list.scss'
})
export class PlatillosListComponent implements OnInit {
  platillos: Platillo[] = [];
  loading = true;
  error = '';

  constructor(private platillosService: PlatillosService) {}

  ngOnInit() {
    this.platillosService.getPlatillos().subscribe({
      next: platillos => {
        this.platillos = platillos;
        this.loading = false;
      },
      error: err => {
        this.error = 'No se pudieron cargar los platillos';
        this.loading = false;
      }
    });
  }
}
