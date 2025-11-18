import { Injectable, inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { FileData } from '@models/file.model';
import { CONTENT_API_URI } from '../../config-api';

@Injectable({
  providedIn: 'root'
})
export class FileApiService {
  private readonly authService = inject(AuthService);







  /**
   * 
   * @param folderId 
   * @returns 
   */
  async getFilesByFolder(folderId: number): Promise<FileData[]> {
    const response = await fetch(`${CONTENT_API_URI}/content/v1/public/files/folder/${folderId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.authService.sessionToken()}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log ('getFileByFolder() : ', data)
    return Array.isArray(data) ? data : [];
  }





  /**
   * Download a file
   * @param fileId - ID of the file to download
   * @returns Blob of the file
   */
  async downloadFile(fileId: number): Promise<{ blob: Blob; filename: string }> {
    const response = await fetch(`${CONTENT_API_URI}/content/v1/public/files/${fileId}/download`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.authService.sessionToken()}`
      }
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
    filename = '[ASMtariSTe.fr]-'+filename

    const blob = await response.blob();
    return { blob, filename };
  }
}