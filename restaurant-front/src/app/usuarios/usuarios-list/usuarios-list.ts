import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { UsuariosService, Usuario } from "../usuarios"
import { Spinner } from "../../shared/spinner/spinner" // Importa el componente Spinner

@Component({
  selector: "app-usuarios-list",
  standalone: true,
  imports: [CommonModule, Spinner], // Añade Spinner
  templateUrl: "./usuarios-list.html",
  styleUrl: "./usuarios-list.scss",
})
export class UsuariosListComponent implements OnInit {
  usuarios: Usuario[] = []
  loading = true
  error = ""

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit() {
    this.usuariosService.getUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios
        this.loading = false
      },
      error: (err) => {
        this.error = "No se pudieron cargar los usuarios"
        this.loading = false
        console.error("Error loading users:", err)
      },
    })
  }
}

