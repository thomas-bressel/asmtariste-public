// Angular imports
import { Injectable, signal, computed } from '@angular/core';

// Model imports
import { FolderData } from '@models/folder.model';

/**
 * Store responsable de la gestion de l'Ã©tat des utilisateurs
 * Utilise des signals Angular pour la rÃ©activitÃ©
 */
@Injectable({
  providedIn: 'root'
})
export class FolderStore {
  // Ã‰tat privÃ©
  private readonly _folders = signal<FolderData[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _selectedFolderId = signal<number | null>(null);

  // Ã‰tat public en lecture seule
  readonly folders = this._folders.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly selectedFolderId = this._selectedFolderId.asReadonly();

  // Computed signals
readonly sortedFolders = computed(() => {
  const folders = this._folders();
  console.log('[STORE COMPUTED] _folders() =', folders);
  console.log('[STORE COMPUTED] length =', folders.length);
  
  if (folders.length === 0) return [];
  
  // Tri simple sans filtre
  const sorted = [...folders].sort((a, b) => {
    const levelA = a.level_required ?? 999;
    const levelB = b.level_required ?? 999;
    return levelA - levelB;
  });
  
  console.log('[STORE COMPUTED] sorted =', sorted);
  return sorted;
});


  readonly selectedFolder = computed(() => {
    const id = this._selectedFolderId();
    if (!id) return null;
    return this._folders().find(folder => folder.id_folder === id) || null;
  });

  readonly activeFolders = computed(() => 
    this.sortedFolders().filter(folder => folder.is_display)
  );

  readonly inactiveFolders = computed(() => 
    this.sortedFolders().filter(folder => !folder.is_display)
  );

  readonly foldersCount = computed(() => this._folders().length);

  // Mutations du state
  setFolders(folders: FolderData[]): void {
    console.log('[STORE] - setFolders() ', folders);
    console.log('[STORE] - Premier folder:', folders[0]);
    console.log('[STORE] - level_required du premier:', folders[0]?.level_required, typeof folders[0]?.level_required);
    this._folders.set(folders);
    this._error.set(null);
  }


  setLoading(loading: boolean): void {
    this._loading.set(loading);
  }

  setError(error: string | null): void {
    this._error.set(error);
  }

  selectFolder(folderId: number | null): void {
    this._selectedFolderId.set(folderId);
  }

  clearStore(): void {
    this._folders.set([]);
    this._loading.set(false);
    this._error.set(null);
    this._selectedFolderId.set(null);
  }
}