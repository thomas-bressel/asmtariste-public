// Angular imports
import { Injectable, signal, computed } from '@angular/core';

// Model imports
import { FolderData } from '@models/folder.model';

/**
 * FOLDER STORE SERVICE - Pure State Management for Folders
 *
 * This store service manages folder state using Angular Signals.
 * It is a pure state management service with NO side effects or API calls.
 *
 * RULES:
 * - NEVER call APIs directly
 * - Only manage state and expose signals
 * - Called EXCLUSIVELY by the facade service
 *
 * @remarks
 * This service provides read-only signals for folder collections with computed
 * signals for sorting, filtering, and selection. Folders are sorted by required
 * level and can be filtered by active/inactive status.
 */
@Injectable({
  providedIn: 'root'
})
export class FolderStore {
  // ===== PRIVATE STATE =====
  /**
   * Private writable signal containing the array of all folders
   */
  private readonly _folders = signal<FolderData[]>([]);

  /**
   * Private writable signal for loading state
   */
  private readonly _loading = signal(false);

  /**
   * Private writable signal for error messages
   */
  private readonly _error = signal<string | null>(null);

  /**
   * Private writable signal for the currently selected folder ID
   */
  private readonly _selectedFolderId = signal<number | null>(null);

  // ===== PUBLIC READ-ONLY SIGNALS =====
  /**
   * Read-only signal exposing the folders array
   */
  readonly folders = this._folders.asReadonly();

  /**
   * Read-only signal exposing the loading state
   */
  readonly loading = this._loading.asReadonly();

  /**
   * Read-only signal exposing error messages
   */
  readonly error = this._error.asReadonly();

  /**
   * Read-only signal exposing the selected folder ID
   */
  readonly selectedFolderId = this._selectedFolderId.asReadonly();

  // ===== COMPUTED SIGNALS =====
  /**
   * Computed signal that sorts folders by required level in ascending order
   * Folders without a level requirement are placed at the end (treated as level 999)
   * @returns Sorted array of folders
   */
  readonly sortedFolders = computed(() => {
    const folders = this._folders();

    if (folders.length === 0) return [];

    // Simple sort without filter
    const sorted = [...folders].sort((a, b) => {
      const levelA = a.level_required ?? 999;
      const levelB = b.level_required ?? 999;
      return levelA - levelB;
    });

    return sorted;
  });

  /**
   * Computed signal that derives the selected folder from the folders array
   * @returns The selected folder object or null if no folder is selected or not found
   */
  readonly selectedFolder = computed(() => {
    const id = this._selectedFolderId();
    if (!id) return null;
    return this._folders().find(folder => folder.id_folder === id) || null;
  });

  /**
   * Computed signal that filters sorted folders to show only active/displayed folders
   * @returns Array of folders where is_display is true
   */
  readonly activeFolders = computed(() =>
    this.sortedFolders().filter(folder => folder.is_display)
  );

  /**
   * Computed signal that filters sorted folders to show only inactive/hidden folders
   * @returns Array of folders where is_display is false
   */
  readonly inactiveFolders = computed(() =>
    this.sortedFolders().filter(folder => !folder.is_display)
  );

  /**
   * Computed signal that calculates the total number of folders
   * @returns The count of folders in the store
   */
  readonly foldersCount = computed(() => this._folders().length);

  // ===== STATE MUTATIONS =====
  /**
   * Sets the folders array and clears any existing errors
   * @param folders - Array of folder data to store
   */
  setFolders(folders: FolderData[]): void {
    this._folders.set(folders);
    this._error.set(null);
  }

  /**
   * Sets the loading state
   * @param loading - Boolean indicating if an operation is in progress
   */
  setLoading(loading: boolean): void {
    this._loading.set(loading);
  }

  /**
   * Sets an error message
   * @param error - The error message to set, or null to clear errors
   */
  setError(error: string | null): void {
    this._error.set(error);
  }

  /**
   * Sets the ID of the currently selected folder
   * @param folderId - The folder ID to select, or null to clear selection
   */
  selectFolder(folderId: number | null): void {
    this._selectedFolderId.set(folderId);
  }

  /**
   * Clears all store data and resets to initial state
   */
  clearStore(): void {
    this._folders.set([]);
    this._loading.set(false);
    this._error.set(null);
    this._selectedFolderId.set(null);
  }
}