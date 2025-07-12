import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { ReportesService } from "../reportes"
import { Spinner } from "../../shared/spinner/spinner" // Importa el componente Spinner

@Component({
  selector: "app-reportes",
  standalone: true,
  imports: [CommonModule, FormsModule, Spinner], // Añade Spinner
  templateUrl: "./reportes.html",
  styleUrl: "./reportes.scss",
})
export class ReportesComponent {
  fecha = ""
  reservas: any[] = []
  platillos: any[] = []
  mesas: any[] = []
  loadingReservas = false // Estado de carga específico para reservas
  loadingPlatillos = false // Estado de carga específico para platillos
  loadingMesas = false // Estado de carga específico para mesas
  errorReservas = ""
  errorPlatillos = ""
  errorMesas = ""

  constructor(private reportesService: ReportesService) {}

  buscarReservasPorFecha() {
    if (!this.fecha) {
      this.errorReservas = "Por favor, selecciona una fecha."
      return
    }
    this.loadingReservas = true
    this.errorReservas = ""
    this.reportesService.getReservasPorFecha(this.fecha).subscribe({
      next: (reservas) => {
        this.reservas = reservas
        this.loadingReservas = false
      },
      error: (err) => {
        this.errorReservas = "No se pudieron cargar las reservas para la fecha seleccionada."
        this.loadingReservas = false
        console.error("Error loading reservas by date:", err)
      },
    })
  }

  cargarPlatillosMasPedidos() {
    this.loadingPlatillos = true
    this.errorPlatillos = ""
    this.reportesService.getPlatillosMasPedidos().subscribe({
      next: (platillos) => {
        this.platillos = platillos
        this.loadingPlatillos = false
      },
      error: (err) => {
        this.errorPlatillos = "No se pudieron cargar los platillos más pedidos."
        this.loadingPlatillos = false
        console.error("Error loading most ordered platillos:", err)
      },
    })
  }

  cargarOcupacionMesas() {
    this.loadingMesas = true
    this.errorMesas = ""
    this.reportesService.getOcupacionMesas().subscribe({
      next: (mesas) => {
        this.mesas = mesas
        this.loadingMesas = false
      },
      error: (err) => {
        this.errorMesas = "No se pudo cargar la ocupación de mesas."
        this.loadingMesas = false
        console.error("Error loading table occupation:", err)
      },
    })
  }
}
