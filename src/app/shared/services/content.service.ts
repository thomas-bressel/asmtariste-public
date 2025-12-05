import { Injectable, inject } from '@angular/core';
import { ContentApiService } from '@services/api/content-api.service';
import { ContentStore } from '@services/store/content-store.service';
import { ContentData } from '@models/content.model';

/**
 * CONTENT FACADE SERVICE - Orchestration Layer
 *
 * Orchestrates content-related operations by coordinating between API and store services.
 * Provides a unified interface for components to manage article content data.
 */
@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private readonly api = inject(ContentApiService);
  private readonly store = inject(ContentStore);

  /** Signal containing content organized by pages */
  readonly contentsByPages = this.store.contentsByPages;
  /** Signal indicating if content is being loaded */
  readonly loading = this.store.loading;
  /** Signal containing any error message */
  readonly error = this.store.error;

  /**
   * Loads content for an article identified by its slug from the API and updates the store
   * Retrieves all content sections/pages associated with the article
   * @param articleSlug - The URL-friendly slug identifier of the article
   * @returns Promise that resolves when content is loaded
   */
  async loadContentByArticleSlug(articleSlug: string): Promise<void> {
    try {
      this.store.setLoading(true);
      this.store.setError(null);

      const contents = await this.api.getContentByArticleSlug(articleSlug);
      // console.log('Content : ', contents)
      this.store.setContents(contents);
    } catch (error) {
      const message = `Error loading content`;
      console.error(message, error);
      this.store.setError(message);
    } finally {
      this.store.setLoading(false);
    }
  }

  /**
   * Clears all content data from the store
   * Resets content, loading state, and errors
   */
  clearStore(): void {
    this.store.clearStore();
  }
}
