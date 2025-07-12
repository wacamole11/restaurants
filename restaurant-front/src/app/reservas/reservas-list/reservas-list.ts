import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ReservasService, Reserva } from "../reservas"
import { Spinner } from "../../shared/spinner/spinner" // Importa el componente Spinner

@Component({
  selector: "app-reservas-list",
  standalone: true,
  imports: [CommonModule, Spinner], // Añade Spinner
  templateUrl: "./reservas-list.html",
  styleUrl: "./reservas-list.scss",
})
export class ReservasListComponent implements OnInit {
  reservas: Reserva[] = []
  loading = true
  error = ""

  constructor(private reservasService: ReservasService) {}

  ngOnInit() {
    this.reservasService.getReservas().subscribe({
      next: (reservas) => {
        this.reservas = reservas
        this.loading = false
      },
      error: (err) => {
        this.error = "No se pudieron cargar las reservas"
        this.loading = false
        console.error("Error loading reservas:", err)
      },
    })
  }
}
