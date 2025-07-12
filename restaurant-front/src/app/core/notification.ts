import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  show(message: string) {
    alert(message); // Puedes reemplazar esto por un snackbar/toast en el futuro
  }
}
