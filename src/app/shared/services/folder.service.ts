// Angular imports
import { Injectable, inject } from '@angular/core';

// Service imports
import { FolderApiService } from '@services/api/folder-api.service';
import { FolderStore } from '@services/store/folder-store.service';

// Model imports
import { FolderData } from '@models/folder.model';

/**
 * Service de façade qui orchestre les appels API et la gestion du store
 * Point d'entrée unique pour les composants
 */
@Injectable({
  providedIn: 'root'
})
export class FolderService {
  private readonly api = inject(FolderApiService);
  private readonly store = inject(FolderStore);

  // Exposition de l'état du store
  readonly folders = this.store.sortedFolders;
  readonly loading = this.store.loading;
  readonly error = this.store.error;
  readonly selectedFolder = this.store.selectedFolder;
  readonly activeFolders = this.store.activeFolders;
  readonly inactiveFolders = this.store.inactiveFolders;
  readonly foldersCount = this.store.foldersCount;

  /**
   * Charge tous les dossiers
   */
  async loadFolders(): Promise<void> {
    try {
      this.store.setLoading(true);
      this.store.setError(null);
      
      // Appel API
      const folders = await this.api.getAllFolders();
      console.log('[SERVICE] - loadFolders() ', folders);

      // Mise à jour du store
      this.store.setFolders(folders);

    } catch (error) {
      const message = 'Erreur lors du chargement des dossiers';
      console.error(message, error);
      this.store.setError(message);
    } finally {
      this.store.setLoading(false);
    }
  }



  /**
   * Sélectionne un dossier
   */
  selectFolder(folderId: number | null): void {
    this.store.selectFolder(folderId);
  }

  /**
   * Vide le store
   */
  clearStore(): void {
    this.store.clearStore();
  }
}