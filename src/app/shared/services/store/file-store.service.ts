import { Injectable, signal, computed } from '@angular/core';
import { FileData } from '@models/file.model';

/**
 * FILE STORE SERVICE - Pure State Management for Files
 *
 * This store service manages file state using Angular Signals.
 * It is a pure state management service with NO side effects or API calls.
 *
 * RULES:
 * - NEVER call APIs directly
 * - Only manage state and expose signals
 * - Called EXCLUSIVELY by the facade service
 *
 * @remarks
 * This service provides read-only signals for file collections with UI state
 * management for grouped files, folder selection, expandable groups, and download states.
 */
@Injectable({
  providedIn: 'root'
})
export class FileStore {
  // ===== PRIVATE STATE =====
  /**
   * Private writable signal containing the array of all files
   */
  private readonly _files = signal<FileData[]>([]);

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

  /**
   * Private writable signal tracking which file groups are expanded/open
   * Uses a Set of label names for O(1) lookup performance
   */
  private readonly _openGroups = signal<Set<string>>(new Set());

  /**
   * Private writable signal tracking which files are currently being downloaded
   * Uses a Set of file IDs for O(1) lookup performance
   */
  private readonly _downloading = signal<Set<number>>(new Set());

  // ===== PUBLIC READ-ONLY SIGNALS =====
  /**
   * Read-only signal exposing the files array
   */
  readonly files = this._files.asReadonly();

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

  /**
   * Read-only signal exposing the set of open/expanded group labels
   */
  readonly openGroups = this._openGroups.asReadonly();

  /**
   * Read-only signal exposing the set of file IDs currently being downloaded
   */
  readonly downloading = this._downloading.asReadonly();

  // ===== COMPUTED SIGNALS =====
  /**
   * Computed signal that calculates the total number of files
   * @returns The count of files in the store
   */
  readonly filesCount = computed(() => this._files().length);

  /**
   * Computed signal that groups files by their label name
   * @returns Array of objects containing label and associated files
   */
  readonly groupedFiles = computed(() => {
    const files = this._files();
    const groups = new Map<string, FileData[]>();

    files.forEach(file => {
      const labelName = file.label.name;
      if (!groups.has(labelName)) {
        groups.set(labelName, []);
      }
      groups.get(labelName)!.push(file);
    });

    return Array.from(groups.entries()).map(([label, files]) => ({ label, files}));
  });





  // ===== STATE MUTATIONS =====
  /**
   * Sets the files array, clears errors, and initializes group expansion state
   * By default, opens only the first group. Other groups remain collapsed.
   * @param files - Array of file data to store
   */
  setFiles(files: FileData[]): void {
    this._files.set(files);
    this._error.set(null);

    const groups = this.groupedFiles();
    if (groups.length > 0) {

      // Opening the 1st group only (index 0)
      this._openGroups.set(new Set([groups[0].label]));

      // Open all groups (alternative approach - currently commented out)
      // this._openGroups.set(new Set(groups.map(g => g.label)));
    }
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
  setSelectedFolderId(folderId: number | null): void {
    this._selectedFolderId.set(folderId);
  }

  /**
   * Toggles the expansion state of a file group
   * If the group is open, it will be closed. If closed, it will be opened.
   * @param label - The label name of the group to toggle
   */
  toggleGroup(label: string): void {
    this._openGroups.update(groups => {
      const newGroups = new Set(groups);
      (newGroups.has(label)) ? newGroups.delete(label) : newGroups.add(label);
      return newGroups;
    });
  }

  /**
   * Checks if a specific file group is currently expanded/open
   * @param label - The label name of the group to check
   * @returns True if the group is open, false otherwise
   */
  isGroupOpen(label: string): boolean {
    return this._openGroups().has(label);
  }





  /**
   * Sets the download state for a specific file
   * Adds or removes the file ID from the downloading set
   * @param fileId - The ID of the file being downloaded
   * @param isDownloading - True to mark as downloading, false to clear the download state
   */
  setDownloading(fileId: number, isDownloading: boolean): void {
    this._downloading.update(downloads => {
      const newDownloads = new Set(downloads);
      if (isDownloading) {
        newDownloads.add(fileId);
      } else {
        newDownloads.delete(fileId);
      }
      return newDownloads;
    });
  }

  /**
   * Checks if a specific file is currently being downloaded
   * @param fileId - The ID of the file to check
   * @returns True if the file is being downloaded, false otherwise
   */
  isDownloading(fileId: number): boolean {
    return this._downloading().has(fileId);
  }



  /**
   * Clears all store data and resets to initial state
   * Resets files, loading, errors, folder selection, and group expansion states
   */
  clearStore(): void {
    this._files.set([]);
    this._loading.set(false);
    this._error.set(null);
    this._selectedFolderId.set(null);
    this._openGroups.set(new Set());
  }
}