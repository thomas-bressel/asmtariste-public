// Angular imports
import { Injectable, inject } from '@angular/core';

// Service imports
import { AuthService } from '../auth.service';

// Model imports
import { FolderData } from '@models/folder.model';

// Config imports
import { CONTENT_API_URI } from '../../config-api';

/**
 * Service responsable uniquement des appels API
 * Aucune gestion d'état, juste des appels HTTP purs
 */
@Injectable({
  providedIn: 'root'
})
export class FolderApiService {
  private readonly authService = inject(AuthService);

  /**
   * Récupère tous les dossier depuis le serveur
   */
  async getAllFolders(): Promise<FolderData[]> {
    const response = await fetch(`${CONTENT_API_URI}/content/v1/public/folders`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.authService.sessionToken()}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  }




}