import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }
  router.navigate(['/login']);
  return false;
};

//Za institucije

export const institutionGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }
  if (authService.isInstitution()) {
    return true;
  }
  router.navigate(['/']);
  return false;
};
// Za parent rute
export const parentGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  if (authService.isParent()) {
    return true;
  }

  router.navigate(['/']);
  return false;
};

// Sprečava ulogovane da idu na login/register
export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    return true;
  }

  if (authService.isInstitution()) {
    router.navigate(['/institution']);
  } else {
    router.navigate(['/home']);
  }

  return false;
};
