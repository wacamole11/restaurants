// src/app/app.config.ts
import { type ApplicationConfig, provideZoneChangeDetection } from "@angular/core"
import { provideRouter } from "@angular/router"
import { provideHttpClient, withInterceptors, withFetch } from "@angular/common/http"
import { jwtInterceptor } from "./core/jwt-interceptor"

import { routes } from "./app.routes"

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // Registra el cliente HTTP y el interceptor globalmente
    provideHttpClient(withInterceptors([jwtInterceptor]), withFetch()),
  ],
}
