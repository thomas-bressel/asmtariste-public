import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MaintenanceService } from '@services/maintenance.service';

/**
 * Maintenance Mode Guard
 *
 * A CanActivateFn guard that blocks access to all protected routes when maintenance mode is active.
 *
 * @description
 * This guard acts as a global site-wide protection mechanism that prevents access to the application
 * during maintenance periods. It checks the maintenance status before allowing any route activation.
 *
 * **Protected Routes:**
 * - Applied to ALL routes except the /maintenance route itself
 * - Blocks access even through direct links or bookmarks
 * - Only the /maintenance page remains accessible during maintenance mode
 *
 * **Activation Conditions:**
 * - Maintenance mode must be inactive (checked via MaintenanceService.isMaintenanceActive())
 * - If maintenance is active, all protected routes are blocked
 *
 * **Behavior on Failure:**
 * - Redirects automatically to '/maintenance' page
 * - Logs warning messages to the console with the blocked route URL
 * - Returns false to prevent route activation
 *
 * **Important Notes:**
 * - This is a high-priority guard that should be checked before other guards
 * - Ensures consistent user experience during maintenance windows
 * - Prevents partial application access that could lead to errors
 *
 * @param route - The activated route snapshot
 * @param state - The router state snapshot containing the requested URL
 *
 * @returns boolean:
 *          - true: Maintenance is inactive, allows navigation to the requested route
 *          - false: Maintenance is active, blocks navigation and redirects to maintenance page
 *
 * @example
 * ```typescript
 * // In route configuration - apply to all routes
 * const routes: Routes = [
 *   {
 *     path: '',
 *     canActivate: [maintenanceGuard],
 *     children: [
 *       { path: 'dashboard', component: DashboardComponent },
 *       { path: 'profile', component: ProfileComponent }
 *     ]
 *   },
 *   {
 *     path: 'maintenance',
 *     component: MaintenanceComponent
 *     // No guard on maintenance page itself
 *   }
 * ];
 * ```
 */
export const maintenanceGuard: CanActivateFn = (route, state) => {
  const maintenanceService = inject(MaintenanceService);
  const router = inject(Router);

  // Check if maintenance mode is active
  if (maintenanceService.isMaintenanceActive()) {
    console.warn('[Maintenance Guard] Access blocked - Site under maintenance');
    console.warn('[Maintenance Guard] Requested route:', state.url);

    // Redirect to the maintenance page
    router.navigate(['/maintenance']);
    return false;
  }

  // Allow access
  return true;
};
