import { Injectable, inject } from '@angular/core';
import { FileData } from '@models/file.model';
import { CONTENT_API_URI } from '../../config-api';
import { AuthApi } from './auth-api.service';

/**
 * File API Service for HTTP Operations
 *
 * This service handles all HTTP requests related to files.
 * It manages file retrieval and download operations with
 * authentication via localStorage tokens.
 *
 * Features:
 * - Retrieve files by folder ID
 * - Download files with proper headers and blob handling
 * - Automatic Bearer token authentication with refresh on 401
 * - Error handling for access denied and not found scenarios
 */
@Injectable({
  providedIn: 'root'
})
export class FileApiService {
  private readonly authApi = inject(AuthApi);

  /**
   * Retrieves all files belonging to a specific folder
   * Makes HTTP GET request with Bearer token authentication
   * @param {number} folderId - The numeric ID of the folder containing the files
   * @returns {Promise<FileData[]>} Promise resolving to array of file data objects
   * @throws {Error} Throws error if HTTP request fails or user is not authenticated
   */
  async getFilesByFolder(folderId: number): Promise<FileData[]> {
    const response = await this.authApi.fetchWithAuth(`${CONTENT_API_URI}/content/v1/public/files/folder/${folderId}`, {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    // console.log('getFileByFolder() : ', data)
    return Array.isArray(data) ? data : [];
  }

  /**
   * Downloads a file by its ID and returns the blob with filename
   * Makes HTTP GET request to download endpoint with Bearer token authentication
   * Automatically prepends '[ASMtariSTe.fr]-' to the filename
   * @param {number} fileId - The numeric ID of the file to download
   * @returns {Promise<{blob: Blob, filename: string}>} Promise resolving to object containing file blob and filename
   * @throws {Error} Throws 'ACCESS_DENIED' if user lacks permissions (403)
   * @throws {Error} Throws 'FILE_NOT_FOUND' if file doesn't exist (404)
   * @throws {Error} Throws generic error for other HTTP failures
   */
  async downloadFile(fileId: number): Promise<{ blob: Blob; filename: string }> {
    const response = await this.authApi.fetchWithAuth(`${CONTENT_API_URI}/content/v1/public/files/${fileId}/download`, {
      method: 'GET'
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('ACCESS_DENIED');
      } else if (response.status === 404) {
        throw new Error('FILE_NOT_FOUND');
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    let filename = response.headers.get('X-Filename') || response.headers.get('x-filename') || 'download';
    filename = '[ASMtariSTe.fr]-' + filename

    const blob = await response.blob();
    return { blob, filename };
  }
}
