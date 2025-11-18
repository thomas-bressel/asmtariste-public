import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { AuthApi } from '@services/api/auth-api.service';



export const signupTokenGuard: CanActivateFn = async (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const authApi = inject(AuthApi);

  const token = route.queryParamMap.get('token');

  if (!token) {
    console.error('Token manquant');
    router.navigate(['/accueil']);
    return false;
  }

  try {
    const response = await authApi.validateSignupToken(token);
    
    if (!response.valid) {
      console.error('Token invalide ou expiré');
      router.navigate(['/accueil']);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erreur de validation du token:', error);
    router.navigate(['/accueil']);
    return false;
  }
};