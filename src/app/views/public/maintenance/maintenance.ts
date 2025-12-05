import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MaintenanceService } from '@services/maintenance.service';

/**
 * Maintenance page component displayed when the site is under maintenance.
 * Route: /maintenance
 *
 * @component
 * @description Displays maintenance information including custom message and end date if available.
 * Provides functionality to check maintenance status and redirect to homepage when maintenance ends.
 */
@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.html',
  styleUrls: ['./maintenance.scss']
})
export class MaintenancePage {
  /**
   * Maintenance service for checking maintenance status and retrieving maintenance information.
   * @public
   * @type {MaintenanceService}
   */
  public maintenance = inject(MaintenanceService);

  /**
   * Angular router for navigation.
   * @private
   * @type {Router}
   */
  private router = inject(Router);

  /**
   * Gets the current maintenance message.
   *
   * @returns {string} The maintenance message to display
   */
  get message(): string {
    return this.maintenance.getMaintenanceMessage();
  }

  /**
   * Gets the maintenance end date if available.
   *
   * @returns {string | null | undefined} The scheduled end date of maintenance, or null/undefined if not set
   */
  get endDate(): string | null | undefined {
    return this.maintenance.getStatus().endDate;
  }

  /**
   * Refreshes the maintenance status by checking with the API.
   * If maintenance is disabled, redirects to the homepage.
   *
   * @returns {Promise<void>}
   */
  async refreshStatus(): Promise<void> {
    // Re-check status with the API
    await this.maintenance.checkStatus();

    // If maintenance is disabled, redirect to homepage
    if (!this.maintenance.isMaintenanceActive()) {
      this.router.navigate(['/accueil']);
    }
  }
}
