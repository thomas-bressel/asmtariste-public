import { Injectable, signal } from '@angular/core';
import { MaintenanceStatus } from '@models/maintenance.model';
import { MaintenanceApiService } from './api/maintenance-api.service';

/**
 * MAINTENANCE FACADE SERVICE - Orchestration Layer
 *
 * RULES:
 * - Single entry point for components to access maintenance status
 * - Manages business logic and state with signals
 * - Calls MaintenanceApiService for data
 * - Uses signals for reactivity
 */

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {

  // State management with signals
  private maintenanceStatus = signal<MaintenanceStatus>({
    enabled: false,
    message: null
  });

  private isLoading = signal<boolean>(false);
  private hasChecked = signal<boolean>(false);

  /** Signal containing the maintenance status (read-only) */
  public readonly status = this.maintenanceStatus.asReadonly();
  /** Signal indicating if maintenance status is being checked (read-only) */
  public readonly loading = this.isLoading.asReadonly();
  /** Signal indicating if maintenance status has been checked (read-only) */
  public readonly checked = this.hasChecked.asReadonly();

  constructor(private maintenanceApi: MaintenanceApiService) {}

  /**
   * Checks the maintenance status from the API
   * Called once at application startup (APP_INITIALIZER)
   * If an error occurs, assumes the site is not in maintenance mode
   * @returns Promise that resolves when status check is complete
   */
  async checkStatus(): Promise<void> {
    this.isLoading.set(true);

    try {
      // console.log('[Maintenance Service] Checking maintenance status...');

      const status = await this.maintenanceApi.getStatus();

      this.maintenanceStatus.set(status);
      this.hasChecked.set(true);

      if (status.enabled) {
        console.warn('[Maintenance Service] ⚠️ Maintenance mode enabled:', status.message);
      } else {
        // console.log('[Maintenance Service] ✅ Site operational');
      }
    } catch (error) {
      console.error('[Maintenance Service] Error checking status:', error);
      // In case of error, assume the site is not in maintenance
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
   * Indicates if the site is currently in maintenance mode
   * @returns True if maintenance is active, false otherwise
   */
  isMaintenanceActive(): boolean {
    return this.maintenanceStatus().enabled;
  }

  /**
   * Retrieves the maintenance message
   * Returns a default message if no custom message is set
   * @returns The maintenance message to display to users
   */
  getMaintenanceMessage(): string {
    return this.maintenanceStatus().message ||
           'Site under maintenance. We will be back very soon.';
  }

  /**
   * Retrieves the complete maintenance status
   * @returns The full maintenance status object
   */
  getStatus(): MaintenanceStatus {
    return this.maintenanceStatus();
  }
}
