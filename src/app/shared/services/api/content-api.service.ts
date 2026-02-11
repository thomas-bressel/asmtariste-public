import { Injectable, inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { ContentData } from '@models/content.model';
import { CONTENT_API_URI, PROJECT_ID } from '../../config-api';

/**
 * Content API Service for HTTP Operations
 *
 * This service handles all HTTP requests related to article content.
 * It retrieves detailed content blocks associated with articles,
 * supporting both numeric ID and slug-based queries.
 *
 * Features:
 * - Retrieve content by article ID
 * - Retrieve content by article slug
 * - Public endpoints (no authentication required)
 * - Returns array of content blocks for rendering
 */
@Injectable({
  providedIn: 'root'
})
export class ContentApiService {
  private readonly authService = inject(AuthService);

  /**
   * Retrieves content blocks for a specific article by its numeric ID
   * Makes HTTP GET request to view endpoint with article ID query parameter
   * @param {number} articleId - The numeric ID of the article
   * @returns {Promise<ContentData[]>} Promise resolving to array of content data objects
   * @throws {Error} Throws error if HTTP request fails
   */
  public async getContentByIdArticle(articleId: number): Promise<ContentData[]> {
    const response = await fetch(`${CONTENT_API_URI}/content/v1/public/content/view?id=${articleId}`, {
      method: 'GET',
      headers: {
        'X-Project-ID': PROJECT_ID
      }
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  }






  /**
   * Retrieves content blocks for a specific article by its slug (URL-friendly identifier)
   * Makes HTTP GET request to view endpoint with article slug query parameter
   * @param {string} articleSlug - The slug identifier of the article
   * @returns {Promise<ContentData[]>} Promise resolving to array of content data objects
   * @throws {Error} Throws error if HTTP request fails
   */
  public async getContentByArticleSlug(articleSlug: string): Promise<ContentData[]> {
    const response = await fetch(`${CONTENT_API_URI}/content/v1/public/content/view?slug=${articleSlug}`, {
      method: 'GET',
      headers: {
        'X-Project-ID': PROJECT_ID
      }
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  }
}