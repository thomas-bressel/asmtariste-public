import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MaintenanceService } from '@services/maintenance.service';

/**
 * MAINTENANCE GUARD
 *
 * Bloque l'accès à TOUTES les routes protégées si le mode maintenance est actif
 * Redirige automatiquement vers /maintenance
 *
 * IMPORTANT:
 * - Appliqué sur TOUTES les routes sauf /maintenance
 * - Empêche l'accès même avec des liens directs ou favoris
 * - Seule la page /maintenance reste accessible
 */

export const maintenanceGuard: CanActivateFn = (route, state) => {
  const maintenanceService = inject(MaintenanceService);
  const router = inject(Router);

  // Vérifier si la maintenance est active
  if (maintenanceService.isMaintenanceActive()) {
    console.warn('[Maintenance Guard] ⛔ Accès bloqué - Site en maintenance');
    console.warn('[Maintenance Guard] Route demandée:', state.url);

    // Rediriger vers la page de maintenance
    router.navigate(['/maintenance']);
    return false;
  }

  // Autoriser l'accès
  return true;
};
