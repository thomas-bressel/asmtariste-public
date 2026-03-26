import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '@services/auth.service';

export const tierGuard = (requiredLevel: number): CanActivateFn => async () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  let profile = authService.profile()?.data;

  if (!profile) {
    try {
      const response = await authService.getProfile();
      profile = response.data;
    } catch {
      router.navigate(['/accueil']);
      return false;
    }
  }

  if (profile.level >= requiredLevel) {
    return true;
  }

  router.navigate(['/accueil']);
  return false;
};
