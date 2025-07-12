import { Injectable } from "@angular/core"
import { HttpClient, HttpResponse } from "@angular/common/http"
import { Observable, tap, map } from "rxjs"

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  password: string
  nombre: string
  apellido?: string
  email: string
  telefono?: string
}

export interface Usuario {
  id: number
  username: string
  nombre: string
  apellido?: string
  email: string
  telefono?: string
  enabled: boolean
  roles: any[]
  // Si el token viene en el cuerpo de la respuesta, podrías añadirlo aquí:
  // token?: string;
}

@Injectable({ providedIn: "root" })
export class AuthService {
  private apiUrl = "http://localhost:8080/api/auth" // Cambia si tu backend usa otro puerto

  constructor(private http: HttpClient) {}

  login(loginRequest: LoginRequest): Observable<Usuario> {
    // Asumimos que el token viene en el encabezado 'Authorization' de la respuesta
    return this.http
      .post<Usuario>(`${this.apiUrl}/login`, loginRequest, { observe: "response" })
      .pipe(
        tap((response: HttpResponse<Usuario>) => {
          const token = response.headers.get("Authorization")
          if (token) {
            // El token suele venir como "Bearer <token>", así que lo extraemos
            const jwtToken = token.replace("Bearer ", "")
            localStorage.setItem("token", jwtToken)
          }
          // Si el token viniera en el cuerpo de la respuesta (ej. response.body.token),
          // lo guardarías aquí: localStorage.setItem('token', response.body.token);
        }),
        tap((response) => console.log("Login successful, user:", response.body)), // Log para depuración
        tap((response) => console.log("Token from header:", response.headers.get("Authorization"))), // Log para depuración
        tap((response) => {
          if (response.body) {
            localStorage.setItem("currentUser", JSON.stringify(response.body)) // Guarda el usuario también
          }
        }),
        // Finalmente, mapeamos para devolver solo el cuerpo de la respuesta
        map((response: HttpResponse<Usuario>) => response.body as Usuario)
      )
  }

  isLoggedIn(): boolean {
    // Verifica si hay un token O un usuario guardado en localStorage
    return !!(this.getToken() || this.getCurrentUser())
  }

  getToken(): string | null {
    // Supón que guardas el token en localStorage bajo 'token'
    return localStorage.getItem("token")
  }

  getCurrentUser(): Usuario | null {
    const userStr = localStorage.getItem("currentUser")
    return userStr ? JSON.parse(userStr) : null
  }

  logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("currentUser")
  }

  register(registerRequest: RegisterRequest): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/register`, registerRequest)
  }
}
