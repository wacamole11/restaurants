import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { AuthService, LoginRequest, RegisterRequest } from "../auth"
import { Router } from "@angular/router"
import { Spinner } from "../../shared/spinner/spinner" // Importa el componente Spinner
import { ButtonComponent } from "../../shared/button/button" // Importa el componente Button

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, FormsModule, Spinner, ButtonComponent], // Añade Spinner y ButtonComponent
  templateUrl: "./login.html",
  styleUrl: "./login.scss",
})
export class LoginComponent {
  // Login form
  username = ""
  password = ""
  
  // Register form
  registerMode = false
  registerData = {
    username: "",
    password: "",
    confirmPassword: "",
    nombre: "",
    apellido: "",
    email: "",
    telefono: ""
  }
  
  error = ""
  loading = false

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  login() {
    this.loading = true
    this.error = ""
    const loginRequest: LoginRequest = {
      username: this.username,
      password: this.password,
    }
    this.authService.login(loginRequest).subscribe({
      next: (user) => {
        this.loading = false
        
        console.log('Usuario logueado:', user);
        console.log('Roles del usuario:', user.roles);
        
        // Determinar el panel según el rol del usuario
        const isAdmin = user.roles && user.roles.some((role: any) => 
          (typeof role === 'string' && (role === 'ADMIN' || role === 'ROLE_ADMIN')) ||
          (typeof role === 'object' && (role.nombre === 'ADMIN' || role.nombre === 'ROLE_ADMIN'))
        );
        
        console.log('¿Es admin?:', isAdmin);
        
        if (isAdmin) {
          console.log('Redirigiendo al panel de administrador');
          this.router.navigate(["/admin"]) // Panel de administrador
        } else {
          console.log('Redirigiendo al panel de usuario');
          this.router.navigate(["/user"]) // Panel de usuario
        }
      },
      error: (err) => {
        this.loading = false
        console.error("Login error:", err)
        this.error = "Usuario o contraseña incorrectos. Por favor, inténtalo de nuevo."
      },
    })
  }

  // Métodos para registro
  toggleRegisterMode() {
    this.registerMode = !this.registerMode
    this.error = ""
    this.loading = false
    // Limpiar formularios
    this.username = ""
    this.password = ""
    this.registerData = {
      username: "",
      password: "",
      confirmPassword: "",
      nombre: "",
      apellido: "",
      email: "",
      telefono: ""
    }
  }

  register() {
    this.loading = true
    this.error = ""

    // Validaciones
    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.error = "Las contraseñas no coinciden"
      this.loading = false
      return
    }

    if (this.registerData.password.length < 6) {
      this.error = "La contraseña debe tener al menos 6 caracteres"
      this.loading = false
      return
    }

    if (!this.registerData.email || !this.registerData.email.includes('@')) {
      this.error = "Por favor ingresa un email válido"
      this.loading = false
      return
    }

    const registerRequest: RegisterRequest = {
      username: this.registerData.username,
      password: this.registerData.password,
      nombre: this.registerData.nombre,
      apellido: this.registerData.apellido || undefined,
      email: this.registerData.email,
      telefono: this.registerData.telefono || undefined
    }

    this.authService.register(registerRequest).subscribe({
      next: (user) => {
        this.loading = false
        alert("¡Registro exitoso! Ahora puedes iniciar sesión.")
        this.toggleRegisterMode() // Volver al modo login
      },
      error: (err) => {
        this.loading = false
        console.error("Register error:", err)
        this.error = err.error?.message || "Error al registrar usuario. Por favor, inténtalo de nuevo."
      }
    })
  }
}
