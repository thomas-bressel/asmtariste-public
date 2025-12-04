import { Injectable } from '@angular/core';
import { MaintenanceStatus } from '@models/maintenance.model';
import { USER_API_URI } from '../../config-api';

/**
 * MAINTENANCE API SERVICE
 *
 * RÈGLES:
 * - Gère les appels HTTP vers l'API User
 * - NE doit être appelé QUE par MaintenanceService (facade)
 * - Retourne les données brutes de l'API
 * - Pas de logique métier, juste HTTP
 * - LECTURE SEULE: ce site ne peut pas modifier le statut de maintenance
 *   (seul le Dashboard Drawer peut le faire)
 */

@Injectable({
  providedIn: 'root'
})
export class MaintenanceApiService {
  private baseUrl = USER_API_URI;

  /**
   * Récupère le statut de maintenance depuis l'API
   * Route publique (pas besoin d'authentification)
   *
   * IMPORTANT: Si l'API ne répond pas correctement (404, 500, timeout, etc.)
   * → On considère que le site EST EN MAINTENANCE
   * → Cela évite d'afficher un site cassé si le backend a un problème
   */
  async getStatus(): Promise<MaintenanceStatus> {
    const headers = new Headers({ 'Content-Type': 'application/json' });

    try {
      const response = await fetch(`${this.baseUrl}/user/v1/public/system/status`, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        // ⚠️ API en erreur (404, 500, etc.) = Site en maintenance
        console.error('[Maintenance API] Erreur API:', response.status, response.statusText);
        return {
          enabled: true,
          message: 'Le site est temporairement indisponible pour maintenance technique. Nous serons de retour très bientôt.'
        };
      }

      // API OK = Retourner le statut réel
      return response.json();
    } catch (error) {
      // ⚠️ Erreur réseau (timeout, connexion refusée, etc.) = Site en maintenance
      console.error('[Maintenance API] Erreur réseau:', error);
      return {
        enabled: true,
        message: 'Le site est temporairement indisponible. Veuillez réessayer dans quelques instants.'
      };
    }
  }
}
