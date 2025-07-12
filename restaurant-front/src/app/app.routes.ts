// src/app/app.routes.ts
import { Routes } from "@angular/router"
import { authGuard } from "./core/auth-guard" // Import authGuard

export const routes: Routes = [
  // Rutas públicas
  {
    path: "auth",
    loadComponent: () => import("./auth/login/login").then((c) => c.LoginComponent),
  },
  
  // Panel de Usuario (Cliente)
  {
    path: "user",
    loadComponent: () => import("./user/user-dashboard/user-dashboard").then((c) => c.UserDashboardComponent),
    canActivate: [authGuard],
    children: [
      {
        path: "",
        redirectTo: "mesas",
        pathMatch: "full"
      },
      {
        path: "mesas",
        loadComponent: () => import("./user/mesas-disponibles/mesas-disponibles").then((c) => c.MesasDisponiblesComponent),
      },
      {
        path: "reservas",
        loadComponent: () => import("./user/mis-reservas/mis-reservas").then((c) => c.MisReservasComponent),
      },
      {
        path: "platillos",
        loadComponent: () => import("./user/menu-platillos/menu-platillos").then((c) => c.MenuPlatillosComponent),
      },
      {
        path: "pedidos",
        loadComponent: () => import("./user/mis-pedidos/mis-pedidos").then((c) => c.MisPedidosComponent),
      },
      {
        path: "historial",
        loadComponent: () => import("./user/historial/historial").then((c) => c.HistorialComponent),
      },
    ]
  },

  // Panel de Administrador
  {
    path: "admin",
    loadComponent: () => import("./admin/admin-dashboard/admin-dashboard").then((c) => c.AdminDashboardComponent),
    canActivate: [authGuard],
    children: [
      {
        path: "",
        redirectTo: "mesas",
        pathMatch: "full"
      },
      {
        path: "mesas",
        loadComponent: () => import("./admin/mesas-gestion/mesas-gestion").then((c) => c.MesasGestionComponent),
      },
      {
        path: "platillos",
        loadComponent: () => import("./admin/platillos-gestion/platillos-gestion").then((c) => c.PlatillosGestionComponent),
      },
      {
        path: "reservas",
        loadComponent: () => import("./admin/reservas-gestion/reservas-gestion").then((c) => c.ReservasGestionComponent),
      },
      {
        path: "usuarios",
        loadComponent: () => import("./admin/usuarios-gestion/usuarios-gestion").then((c) => c.UsuariosGestionComponent),
      }
    ]
  },

  // Rutas por defecto
  { path: "", redirectTo: "auth", pathMatch: "full" },
  { path: "**", redirectTo: "auth" },
]
