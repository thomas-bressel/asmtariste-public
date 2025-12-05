import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '@services/auth.service';

/**
 * Authentication Guard
 *
 * A CanActivateFn guard that protects routes requiring user authentication.
 *
 * @description
 * This guard checks if the user is authenticated before allowing access to protected routes.
 * It verifies both the authentication status and the presence of a valid session token.
 *
 * **Protected Routes:**
 * - All routes that require a logged-in user
 * - Private user areas and restricted features
 *
 * **Activation Conditions:**
 * - User must be authenticated (verified via AuthService.isAuthenticated())
 * - A valid session token must be present (AuthService.sessionToken())
 *
 * **Behavior on Failure:**
 * - If no active session is found, redirects to '/accueil' (home page)
 * - Logs an error message to the console
 * - Returns false to prevent route activation
 *
 * @param route - The activated route snapshot (not used in current implementation)
 * @param state - The router state snapshot (not used in current implementation)
 *
 * @returns A Promise<boolean> or boolean:
 *          - true: Allows navigation to the protected route
 *          - false: Blocks navigation and redirects to home page
 *
 * @example
 * ```typescript
 * // In route configuration
 * const routes: Routes = [
 *   {
 *     path: 'dashboard',
 *     component: DashboardComponent,
 *     canActivate: [authGuard]
 *   }
 * ];
 * ```
 */
export const authGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  // Check if the user is authenticated via the signal
  if (authService.isAuthenticated()) {
    return true;
  }

  // If no session token is present, redirect to home page
  if (!authService.sessionToken()) {
    console.error('No active session');
    router.navigate(['/accueil']);
    return false;
  }

  // If the token exists but the user is not loaded, redirect to home
  // (Session verification should normally be done at application startup)
  router.navigate(['/accueil']);
  return false;
};
