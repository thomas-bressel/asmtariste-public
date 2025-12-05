// Angular imports
import { Injectable, inject } from '@angular/core';

// Service imports
import { FolderApiService } from '@services/api/folder-api.service';
import { FolderStore } from '@services/store/folder-store.service';


/**
 * FOLDER FACADE SERVICE - Orchestration Layer
 *
 * Orchestrates folder-related operations by coordinating between API and store services.
 * Provides a unified interface for components to manage folder data.
 */
@Injectable({
  providedIn: 'root'
})
export class FolderService {
  private readonly api = inject(FolderApiService);
  private readonly store = inject(FolderStore);

  /** Signal containing sorted folders */
  readonly folders = this.store.sortedFolders;
  /** Signal indicating if folders are being loaded */
  readonly loading = this.store.loading;
  /** Signal containing any error message */
  readonly error = this.store.error;
  /** Signal containing the currently selected folder */
  readonly selectedFolder = this.store.selectedFolder;
  /** Signal containing active folders only */
  readonly activeFolders = this.store.activeFolders;
  /** Signal containing inactive folders only */
  readonly inactiveFolders = this.store.inactiveFolders;
  /** Signal containing the total count of folders */
  readonly foldersCount = this.store.foldersCount;

  /**
   * Loads all folders from the API and updates the store
   * Sets loading state and handles errors appropriately
   * @returns Promise that resolves when folders are loaded
   */
  async loadFolders(): Promise<void> {
    // console.log("\x1b[32m[SERVICE] - loadFolders() called \x1b[0m");
    try {
      this.store.setLoading(true);
      this.store.setError(null);
      
      // Appel API
      const folders = await this.api.getAllFolders();
      // console.log("\x1b[32m[SERVICE] - loadFolders() - folders \x1b[0m", folders);

      // Mise à jour du store
      this.store.setFolders(folders);

    } catch (error) {
      const message = 'Error loading folders';
      console.error(message, error);
      this.store.setError(message);
    } finally {
      this.store.setLoading(false);
    }
  }

  /**
   * Selects a folder in the store for display or filtering
   * @param folderId - The ID of the folder to select, or null to deselect
   */
  selectFolder(folderId: number | null): void {
    this.store.selectFolder(folderId);
  }

  /**
   * Clears all folder data from the store
   * Resets folders, loading state, errors, and selection
   */
  clearStore(): void {
    this.store.clearStore();
  }
}