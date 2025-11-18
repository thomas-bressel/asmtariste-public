import { Injectable, inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { ContentData } from '@models/content.model';
import { CONTENT_API_URI } from '../../config-api';

@Injectable({
  providedIn: 'root'
})
export class ContentApiService {
  private readonly authService = inject(AuthService);



  
  /**
   * Retrieves content by article ID
   * @param articleId The article ID
   * @returns Content data array
   */
  public async getContentByIdArticle(articleId: number): Promise<ContentData[]> {
    const response = await fetch(`${CONTENT_API_URI}/content/v1/public/content/view?id=${articleId}`, {
      method: 'GET'
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  }






  /**
   * Retrieves content by article ID
   * @param articleId The article ID
   * @returns Content data array
   */
  public async getContentByArticleSlug(articleSlug: string): Promise<ContentData[]> {
    const response = await fetch(`${CONTENT_API_URI}/content/v1/public/content/view?slug=${articleSlug}`, {
      method: 'GET'
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  }
}