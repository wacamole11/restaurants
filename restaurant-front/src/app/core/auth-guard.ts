import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isLoggedIn && authService.isLoggedIn()) {
    return true;
  } else {
    router.navigate(['/auth/login']);
    return false;
  }
};
