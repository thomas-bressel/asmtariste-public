import { Injectable, signal, computed } from '@angular/core';
import { FileData } from '@models/file.model';

@Injectable({
  providedIn: 'root'
})
export class FileStore {
  private readonly _files = signal<FileData[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _selectedFolderId = signal<number | null>(null);
  private readonly _openGroups = signal<Set<string>>(new Set());
  private readonly _downloading = signal<Set<number>>(new Set());

  readonly files = this._files.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly selectedFolderId = this._selectedFolderId.asReadonly();
  readonly openGroups = this._openGroups.asReadonly();
  readonly downloading = this._downloading.asReadonly();


  readonly filesCount = computed(() => this._files().length);

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





/**
 * Define with group are opened by default
 * @param files 
 */
  setFiles(files: FileData[]): void {
    this._files.set(files);
    this._error.set(null);

    const groups = this.groupedFiles();
    if (groups.length > 0) {

      // Opening the 1st group only (index 0)
      this._openGroups.set(new Set([groups[0].label]));
      
      // Open all groups
      // this._openGroups.set(new Set(groups.map(g => g.label)));
    }
  }







  setLoading(loading: boolean): void {
    this._loading.set(loading);
  }







  setError(error: string | null): void {
    this._error.set(error);
  }







  setSelectedFolderId(folderId: number | null): void {
    this._selectedFolderId.set(folderId);
  }







  toggleGroup(label: string): void {
    this._openGroups.update(groups => {
      const newGroups = new Set(groups);
      (newGroups.has(label)) ? newGroups.delete(label) : newGroups.add(label);
      return newGroups;
    });
  }







  isGroupOpen(label: string): boolean {
    return this._openGroups().has(label);
  }





/**
 * 
 * @param fileId 
 * @param isDownloading 
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







  isDownloading(fileId: number): boolean {
    return this._downloading().has(fileId);
  }






  clearStore(): void {
    this._files.set([]);
    this._loading.set(false);
    this._error.set(null);
    this._selectedFolderId.set(null);
    this._openGroups.set(new Set());
  }
}