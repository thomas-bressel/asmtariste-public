// Angular imports
import { Injectable, inject } from '@angular/core';

// Model imports
import { FolderData } from '@models/folder.model';

// Config imports
import { CONTENT_API_URI } from '../../config-api';

// Service imports
import { AuthApi } from './auth-api.service';

/**
 * Folder API Service for HTTP Operations
 *
 * This service is responsible only for API calls related to folders.
 * It handles pure HTTP operations without any state management.
 *
 * Features:
 * - Retrieves folders from the content API
 * - Manages authentication via localStorage tokens
 * - Returns raw API data without transformation
 */
@Injectable({
  providedIn: 'root'
})
export class FolderApiService {
  private readonly authApi = inject(AuthApi);

  /**
   * Retrieves all folders from the server
   * Makes HTTP GET request with Bearer token authentication
   * @returns {Promise<FolderData[]>} Promise resolving to array of folder data objects
   * @throws {Error} Throws error if HTTP request fails or user is not authenticated
   */
  async getAllFolders(): Promise<FolderData[]> {
    // console.log("\x1b[34m[API] - getAllFolders() called \x1b[0m");

    const response = await this.authApi.fetchWithAuth(`${CONTENT_API_URI}/content/v1/public/folders`, {
      method: 'GET'
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

    const data = await response.json();
    // console.log("\x1b[34m[API] - getAllFolders() - data: \x1b[0m", data);

    return Array.isArray(data) ? data : [];
  }



}