import { Injectable, inject } from '@angular/core';
import { FileApiService } from '@services/api/file-api.service';
import { FileStore } from '@services/store/file-store.service';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private readonly api = inject(FileApiService);
  private readonly store = inject(FileStore);

  readonly files = this.store.files;
  readonly groupedFiles = this.store.groupedFiles;
  readonly loading = this.store.loading;
  readonly error = this.store.error;
  readonly selectedFolderId = this.store.selectedFolderId;
  readonly filesCount = this.store.filesCount;
  readonly downloading = this.store.downloading;






  /**
   * 
   * @param folderId 
   */
  async loadFilesByFolder(folderId: number): Promise<void> {
    try {
      this.store.setLoading(true);
      this.store.setError(null);
      this.store.setSelectedFolderId(folderId);

      const files = await this.api.getFilesByFolder(folderId);
      this.store.setFiles(files);
    } catch (error) {
      const message = 'Erreur lors du chargement des fichiers';
      console.error(message, error);
      this.store.setError(message);
    } finally {
      this.store.setLoading(false);
    }
  }






  /**
   * Download a file
   * @param fileId - ID of the file to download
   */
  async downloadFile(fileId: number): Promise<void> {
    try {
      this.store.setDownloading(fileId, true);
      
      const { blob, filename } = await this.api.downloadFile(fileId);
      
      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (error: any) {
      console.error('Erreur lors du téléchargement:', error);
      
      if (error.message === 'ACCESS_DENIED') {
        alert('Accès refusé. Vous devez avoir un abonnement supérieur pour télécharger ce fichier.');
      } else if (error.message === 'FILE_NOT_FOUND') {
        alert('Fichier non trouvé.');
      } else {
        alert('Une erreur est survenue lors du téléchargement.');
      }
    } finally {
      this.store.setDownloading(fileId, false);
    }
  }






  
  /**
   * Check if a file is currently downloading
   */
  isDownloading(fileId: number): boolean {
    return this.store.isDownloading(fileId);
  }






  toggleGroup(label: string): void {
    this.store.toggleGroup(label);
  }







  isGroupOpen(label: string): boolean {
    return this.store.isGroupOpen(label);
  }







  clearStore(): void {
    this.store.clearStore();
  }
}