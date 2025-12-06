import { Injectable, inject } from '@angular/core';


import { FileApiService } from '@services/api/file-api.service';
import { FileStore } from '@services/store/file-store.service';
import { NotificationService } from './ui/notification.service';
import { AnalyticsService } from './analytics.service';
/**
 * FILE FACADE SERVICE - Orchestration Layer
 *
 * Orchestrates file-related operations by coordinating between API and store services.
 * Provides a unified interface for components to manage file data and downloads.
 */
@Injectable({
  providedIn: 'root'
})
export class FileService {
  private readonly api = inject(FileApiService);
  private readonly store = inject(FileStore);
  private readonly notification = inject(NotificationService);
  private readonly analytics = inject(AnalyticsService)

  /** Signal containing all files */
  readonly files = this.store.files;
  /** Signal containing files grouped by categories or labels */
  readonly groupedFiles = this.store.groupedFiles;
  /** Signal indicating if files are being loaded */
  readonly loading = this.store.loading;
  /** Signal containing any error message */
  readonly error = this.store.error;
  /** Signal containing the ID of the currently selected folder */
  readonly selectedFolderId = this.store.selectedFolderId;
  /** Signal containing the total count of files */
  readonly filesCount = this.store.filesCount;
  /** Signal containing the downloading state for files */
  readonly downloading = this.store.downloading;



  /**
   * Loads files filtered by folder from the API and updates the store
   * Sets the selected folder ID and fetches all associated files
   * @param folderId - The ID of the folder to load files from
   * @returns Promise that resolves when files are loaded
   */
  async loadFilesByFolder(folderId: number): Promise<void> {
    try {
      this.store.setLoading(true);
      this.store.setError(null);
      this.store.setSelectedFolderId(folderId);

      const files = await this.api.getFilesByFolder(folderId);
      this.store.setFiles(files);
    } catch (error) {
      const message = 'Error loading files';
      console.error(message, error);
      this.store.setError(message);
    } finally {
      this.store.setLoading(false);
    }
  }






  /**
   * Downloads a file and triggers browser download
   * Creates a temporary link element to initiate the download
   * Handles permission errors and subscription requirements
   * @param fileId - The ID of the file to download
   * @returns Promise that resolves when download is initiated
   * @throws Error if access is denied, file not found, or download fails
   */
  async downloadFile(fileId: number): Promise<void> {
    try {
      this.store.setDownloading(fileId, true);

      const { blob, filename } = await this.api.downloadFile(fileId);

      // Track download in Google Analytics
      this.analytics.trackEvent('file_download', {
        file_name: filename,
        file_id: fileId,
        event_category: 'engagement'
      });

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error: any) {
      console.error('Error during download:', error);

      if (error.message === 'ACCESS_DENIED') {
        this.notification.show('access.error');
      } else if (error.message === 'FILE_NOT_FOUND') {
        this.notification.show('file.error');
      } else {
        this.notification.show('generic.error');
      }
    } finally {
      this.store.setDownloading(fileId, false);
    }
  }






  /**
   * Checks if a file is currently being downloaded
   * @param fileId - The ID of the file to check
   * @returns True if the file is currently downloading, false otherwise
   */
  isDownloading(fileId: number): boolean {
    return this.store.isDownloading(fileId);
  }

  /**
   * Toggles the collapsed/expanded state of a file group
   * Used for accordion-style file grouping in the UI
   * @param label - The label identifier of the group to toggle
   */
  toggleGroup(label: string): void {
    this.store.toggleGroup(label);
  }

  /**
   * Checks if a file group is currently expanded
   * @param label - The label identifier of the group to check
   * @returns True if the group is open/expanded, false if collapsed
   */
  isGroupOpen(label: string): boolean {
    return this.store.isGroupOpen(label);
  }

  /**
   * Clears all file data from the store
   * Resets files, loading state, errors, and download states
   */
  clearStore(): void {
    this.store.clearStore();
  }
}