import { Injectable } from '@angular/core';
import { MaintenanceStatus } from '@models/maintenance.model';
import { USER_API_URI, PROJECT_ID } from '../../config-api';

/**
 * Maintenance API Service for HTTP Operations
 *
 * This service handles HTTP requests to check the maintenance status
 * of the application. It provides a read-only interface to the maintenance
 * status endpoint.
 *
 * RULES:
 * - Handles HTTP calls to the User API for maintenance status
 * - Should ONLY be called by MaintenanceService (facade)
 * - Returns raw API data without transformation
 * - No business logic, just HTTP operations
 * - READ-ONLY: this site cannot modify maintenance status
 *   (only the Dashboard Drawer can do that)
 *
 * IMPORTANT BEHAVIOR:
 * - If API doesn't respond correctly (404, 500, timeout, etc.)
 * - The site is considered IN MAINTENANCE mode
 * - This prevents displaying a broken site if the backend has issues
 */

@Injectable({
  providedIn: 'root'
})
export class MaintenanceApiService {
  private baseUrl = USER_API_URI;

  /**
   * Retrieves the maintenance status from the API
   * Public route (no authentication required)
   * Makes HTTP GET request to system status endpoint
   *
   * IMPORTANT: If the API doesn't respond correctly (404, 500, timeout, etc.)
   * the site is considered IN MAINTENANCE mode
   * This prevents displaying a broken site if the backend has issues
   *
   * @returns {Promise<MaintenanceStatus>} Promise resolving to maintenance status object
   * @returns {MaintenanceStatus} Returns {enabled: true, message: string} if API fails or network error occurs
   */
  async getStatus(): Promise<MaintenanceStatus> {
    const headers = new Headers({ 
      'Content-Type': 'application/json',
      'X-Project-ID': PROJECT_ID 
    });

    try {
      const response = await fetch(`${this.baseUrl}/user/v1/public/system/status`, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        // Warning: API error (404, 500, etc.) = Site in maintenance mode
        console.error('[Maintenance API] API Error:', response.status, response.statusText);
        return {
          enabled: true,
          message: 'The site is temporarily unavailable for technical maintenance. We will be back very soon.'
        };
      }

      // API OK = Return the actual status
      return response.json();
    } catch (error) {
      // Warning: Network error (timeout, connection refused, etc.) = Site in maintenance mode
      console.error('[Maintenance API] Network Error:', error);
      return {
        enabled: true,
        message: 'The site is temporarily unavailable. Please try again in a few moments.'
      };
    }
  }
}
