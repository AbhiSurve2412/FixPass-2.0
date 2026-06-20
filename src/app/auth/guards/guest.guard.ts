import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../store/auth.store';

export const guestGuard: CanActivateFn = () => {
  const store  = inject(AuthStore);
  const router = inject(Router);
  return store.isLoggedIn() ? router.createUrlTree(['/']) : true;
};
