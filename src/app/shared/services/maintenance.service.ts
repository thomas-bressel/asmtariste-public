import { Injectable, signal } from '@angular/core';
import { MaintenanceStatus } from '@models/maintenance.model';
import { MaintenanceApiService } from './api/maintenance-api.service';

/**
 * MAINTENANCE SERVICE (Facade)
 *
 * RÈGLES:
 * - Seul service accessible depuis les composants
 * - Gère la logique métier et le state
 * - Appelle MaintenanceApiService pour les données
 * - Utilise des signals pour la réactivité
 */

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {

  // State management avec signals
  private maintenanceStatus = signal<MaintenanceStatus>({
    enabled: false,
    message: null
  });

  private isLoading = signal<boolean>(false);
  private hasChecked = signal<boolean>(false);

  // Exposition des signals en lecture seule
  public readonly status = this.maintenanceStatus.asReadonly();
  public readonly loading = this.isLoading.asReadonly();
  public readonly checked = this.hasChecked.asReadonly();

  constructor(private maintenanceApi: MaintenanceApiService) {}

  /**
   * Vérifie le statut de maintenance auprès de l'API
   * Appelé une seule fois au démarrage de l'application (APP_INITIALIZER)
   */
  async checkStatus(): Promise<void> {
    this.isLoading.set(true);

    try {
      // console.log('[Maintenance Service] Vérification du statut de maintenance...');

      const status = await this.maintenanceApi.getStatus();

      this.maintenanceStatus.set(status);
      this.hasChecked.set(true);

      if (status.enabled) {
        console.warn('[Maintenance Service] ⚠️ Mode maintenance activé:', status.message);
      } else {
        // console.log('[Maintenance Service] ✅ Site opérationnel');
      }
    } catch (error) {
      console.error('[Maintenance Service] Erreur lors de la vérification:', error);
      // En cas d'erreur, on considère que le site n'est pas en maintenance
      this.maintenanceStatus.set({
        enabled: false,
        message: null
      });
      this.hasChecked.set(true);
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Indique si le site est actuellement en maintenance
   */
  isMaintenanceActive(): boolean {
    return this.maintenanceStatus().enabled;
  }

  /**
   * Récupère le message de maintenance
   */
  getMaintenanceMessage(): string {
    return this.maintenanceStatus().message ||
           'Site en maintenance. Nous serons de retour très bientôt.';
  }

  /**
   * Récupère le statut complet
   */
  getStatus(): MaintenanceStatus {
    return this.maintenanceStatus();
  }
}
