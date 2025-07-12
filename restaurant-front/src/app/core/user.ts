import { Injectable } from '@angular/core';
import { Usuario } from '../auth/auth';

@Injectable({ providedIn: 'root' })
export class UserService {
  private userKey = 'currentUser';

  setUser(user: Usuario) {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  getUser(): Usuario | null {
    const data = localStorage.getItem(this.userKey);
    return data ? JSON.parse(data) : null;
  }

  clearUser() {
    localStorage.removeItem(this.userKey);
  }
}
