/**
 * Maintenance Status Model
 * Représente l'état de maintenance du site
 */

export interface MaintenanceStatus {
  /** Indique si le mode maintenance est actif */
  enabled: boolean;

  /** Message à afficher pendant la maintenance */
  message: string | null;

  /** Date de début de la maintenance (optionnel) */
  startDate?: string | null;

  /** Date de fin prévue de la maintenance (optionnel) */
  endDate?: string | null;
}

/**
 * Configuration de maintenance en cache
 */
export interface MaintenanceCache {
  status: MaintenanceStatus;
  cachedAt: number; // Timestamp
}
