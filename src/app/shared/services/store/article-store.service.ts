import { Injectable, signal, computed } from '@angular/core';
import { ArticleData } from '@models/article.model';

/**
 * ARTICLE STORE SERVICE - Pure State Management for Articles
 *
 * This store service manages article state using Angular Signals.
 * It is a pure state management service with NO side effects or API calls.
 *
 * RULES:
 * - NEVER call APIs directly
 * - Only manage state and expose signals
 * - Called EXCLUSIVELY by the facade service
 *
 * @remarks
 * This service provides read-only signals for article collections and individual articles,
 * along with computed signals for derived state like selected article and article count.
 */
@Injectable({
  providedIn: 'root'
})
export class ArticleStore {
  // ===== PRIVATE STATE =====
  /**
   * Private writable signal containing the array of all articles
   */
  private readonly _articles = signal<ArticleData[]>([]);

  /**
   * Private writable signal for a single article fetched by ID
   */
  private readonly _articleById = signal<ArticleData | null>(null);

  /**
   * Private writable signal for loading state
   */
  private readonly _loading = signal(false);

  /**
   * Private writable signal for error messages
   */
  private readonly _error = signal<string | null>(null);

  /**
   * Private writable signal for the currently selected article ID
   */
  private readonly _selectedArticleId = signal<number | null>(null);

  // ===== PUBLIC READ-ONLY SIGNALS =====
  /**
   * Read-only signal exposing the articles array
   */
  readonly articles = this._articles.asReadonly();

  /**
   * Read-only signal exposing the article fetched by ID
   */
  readonly articleById = this._articleById.asReadonly();

  /**
   * Read-only signal exposing the loading state
   */
  readonly loading = this._loading.asReadonly();

  /**
   * Read-only signal exposing error messages
   */
  readonly error = this._error.asReadonly();

  /**
   * Read-only signal exposing the selected article ID
   */
  readonly selectedArticleId = this._selectedArticleId.asReadonly();

  // ===== COMPUTED SIGNALS =====
  /**
   * Computed signal that derives the selected article from the articles array
   * @returns The selected article object or null if no article is selected or not found
   */
  readonly selectedArticle = computed(() => {
    const id = this._selectedArticleId();
    if (!id) return null;
    return this._articles().find(article => article.id_articles === id) || null;
  });

  /**
   * Computed signal that calculates the total number of articles
   * @returns The count of articles in the store
   */
  readonly articlesCount = computed(() => this._articles().length);

  // ===== STATE MUTATIONS =====
  /**
   * Sets the articles array and clears any existing errors
   * @param articles - Array of article data to store
   */
  setArticles(articles: ArticleData[]): void {
    this._articles.set(articles);
    this._error.set(null);
  }

  /**
   * Sets a single article fetched by ID and clears any existing errors
   * @param article - The article data to store
   */
  setArticleById(article: ArticleData): void {
    this._articleById.set(article);
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
   * Sets the ID of the currently selected article
   * @param articleId - The article ID to select, or null to clear selection
   */
  selectArticle(articleId: number | null): void {
    this._selectedArticleId.set(articleId);
  }

  /**
   * Clears all store data and resets to initial state
   */
  clearStore(): void {
    this._articles.set([]);
    this._articleById.set(null);
    this._loading.set(false);
    this._error.set(null);
    this._selectedArticleId.set(null);
  }
}