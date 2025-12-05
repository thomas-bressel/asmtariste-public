import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { AuthApi } from '@services/api/auth-api.service';

/**
 * Signup Token Validation Guard
 *
 * A CanActivateFn guard that validates signup/session tokens before allowing access to registration routes.
 *
 * @description
 * This guard protects the signup process by validating tokens passed as query parameters.
 * It ensures that only users with valid, unexpired signup tokens can access the registration pages.
 * The token is typically sent via email or generated during the signup initiation process.
 *
 * **Protected Routes:**
 * - Signup completion pages
 * - Account activation routes
 * - Any route requiring a valid signup session token
 *
 * **Activation Conditions:**
 * - A 'session' query parameter must be present in the URL
 * - The token must be validated successfully via the API (AuthApi.validateSignupToken())
 * - The token must not be expired or invalid
 *
 * **Behavior on Failure:**
 * - Missing token: Redirects to '/accueil' (home page) and logs "Token missing" error
 * - Invalid/expired token: Redirects to '/accueil' and logs "Invalid or expired token" error
 * - API validation error: Redirects to '/accueil' and logs the validation error
 * - Returns false in all failure cases to prevent route activation
 *
 * **Token Validation:**
 * - Extracts token from query parameter 'session'
 * - Performs asynchronous API validation
 * - Handles both invalid tokens and network/API errors
 *
 * @param route - The activated route snapshot containing query parameters
 * @param state - The router state snapshot (not used in current implementation)
 *
 * @returns A Promise<boolean>:
 *          - true: Token is valid, allows navigation to the signup route
 *          - false: Token is missing/invalid/expired, blocks navigation and redirects to home
 *
 * @example
 * ```typescript
 * // In route configuration
 * const routes: Routes = [
 *   {
 *     path: 'signup/complete',
 *     component: SignupCompleteComponent,
 *     canActivate: [signupTokenGuard]
 *   }
 * ];
 *
 * // URL with token
 * // https://example.com/signup/complete?session=abc123def456
 * ```
 */
export const signupTokenGuard: CanActivateFn = async (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const authApi = inject(AuthApi);

  const token = route.queryParamMap.get('session');

  if (!token) {
    console.error('Token missing');
    router.navigate(['/accueil']);
    return false;
  }

  try {
    const response = await authApi.validateSignupToken(token);

    if (!response.valid) {
      console.error('Invalid or expired token');
      router.navigate(['/accueil']);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Token validation error:', error);
    router.navigate(['/accueil']);
    return false;
  }
};