import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MesasService, Mesa } from "../mesas"
import { Spinner } from "../../shared/spinner/spinner" // Importa el componente Spinner

@Component({
  selector: "app-mesas-list",
  standalone: true,
  imports: [CommonModule, Spinner], // Añade Spinner
  templateUrl: "./mesas-list.html",
  styleUrl: "./mesas-list.scss",
})
export class MesasListComponent implements OnInit {
  mesas: Mesa[] = []
  loading = true
  error = ""

  constructor(private mesasService: MesasService) {}

  ngOnInit() {
    this.mesasService.getMesas().subscribe({
      next: (mesas) => {
        this.mesas = mesas
        this.loading = false
      },
      error: (err) => {
        this.error = "No se pudieron cargar las mesas"
        this.loading = false
        console.error("Error loading mesas:", err)
      },
    })
  }
}

