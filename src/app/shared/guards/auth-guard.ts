import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '@services/auth.service';

export const authGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  // Vérifier si l'utilisateur est authentifié via le signal
  if (authService.isAuthenticated()) {
    return true;
  }

  // Si pas de token de session, rediriger vers l'accueil
  if (!authService.sessionToken()) {
    console.error('Aucune session active');
    router.navigate(['/accueil']);
    return false;
  }

  // Si le token existe mais l'utilisateur n'est pas chargé, on peut tenter de vérifier
  // la session (cela devrait normalement être fait au démarrage de l'app)
  router.navigate(['/accueil']);
  return false;
};
