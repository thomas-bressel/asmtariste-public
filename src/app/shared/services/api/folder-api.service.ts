// Angular imports
import { Injectable } from '@angular/core';

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

  /**
   * Crée les headers avec le token Bearer depuis localStorage
   */
  private createAuthHeaders(): Headers {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const token = localStorage.getItem('session_token');
    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  /**
   * Récupère tous les dossier depuis le serveur
   */
  async getAllFolders(): Promise<FolderData[]> {
    // console.log("\x1b[34m[API] - getAllFolders() called \x1b[0m");

    const response = await fetch(`${CONTENT_API_URI}/content/v1/public/folders`, {
      method: 'GET',
      headers: this.createAuthHeaders()
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

    const data = await response.json();
    // console.log("\x1b[34m[API] - getAllFolders() - data: \x1b[0m", data);

    return Array.isArray(data) ? data : [];
  }



}