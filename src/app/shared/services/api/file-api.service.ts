import { Injectable } from '@angular/core';
import { FileData } from '@models/file.model';
import { CONTENT_API_URI, PROJECT_ID } from '../../config-api';

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
 * - Automatic Bearer token authentication
 * - Error handling for access denied and not found scenarios
 */
@Injectable({
  providedIn: 'root'
})
export class FileApiService {

  /**
   * Creates HTTP headers with Bearer token from localStorage
   * @private
   * @returns {Headers} Headers object with Content-Type and Authorization (if token exists)
   */
  private createAuthHeaders(): Headers {
    const headers = new Headers({ 
      'Content-Type': 'application/json',
      'X-Project-ID': PROJECT_ID 
    });
    const token = localStorage.getItem('session_token');
    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    }
    return headers;
  }




  /**
   * Retrieves all files belonging to a specific folder
   * Makes HTTP GET request with Bearer token authentication
   * @param {number} folderId - The numeric ID of the folder containing the files
   * @returns {Promise<FileData[]>} Promise resolving to array of file data objects
   * @throws {Error} Throws error if HTTP request fails or user is not authenticated
   */
  async getFilesByFolder(folderId: number): Promise<FileData[]> {
    const response = await fetch(`${CONTENT_API_URI}/content/v1/public/files/folder/${folderId}`, {
      method: 'GET',
      headers: this.createAuthHeaders()
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
    const response = await fetch(`${CONTENT_API_URI}/content/v1/public/files/${fileId}/download`, {
      method: 'GET',
      headers: this.createAuthHeaders()
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