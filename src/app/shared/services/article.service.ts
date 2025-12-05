import { Injectable, inject } from '@angular/core';
import { ArticleApiService } from '@services/api/article-api.service';
import { ArticleStore } from '@services/store/article-store.service';
import { ArticleData } from '@models/article.model';

/**
 * ARTICLE FACADE SERVICE - Orchestration Layer
 *
 * Orchestrates article-related operations by coordinating between API and store services.
 * Provides a unified interface for components to manage article data.
 */
@Injectable({
    providedIn: 'root'
})
export class ArticleService {
    private readonly api = inject(ArticleApiService);
    private readonly store = inject(ArticleStore);

    /** Signal containing all articles */
    readonly articles = this.store.articles;
    /** Signal containing a specific article by ID */
    readonly articleById = this.store.articleById;
    /** Signal indicating if articles are being loaded */
    readonly loading = this.store.loading;
    /** Signal containing any error message */
    readonly error = this.store.error;
    /** Signal containing the currently selected article */
    readonly selectedArticle = this.store.selectedArticle;
    /** Signal containing the total count of articles */
    readonly articlesCount = this.store.articlesCount;

    /**
     * Loads all articles from the API and updates the store
     * Sets loading state and handles errors appropriately
     * @returns Promise that resolves when articles are loaded
     */
    public async loadArticles(): Promise<void> {
        try {
            this.store.setLoading(true);
            this.store.setError(null);

            const articles: ArticleData[] = await this.api.getAllArticles();
            // console.log('[SERVICE] - loadArticles() ', articles);

            this.store.setArticles(articles);
        } catch (error) {
            const message = 'Error loading articles';
            console.error(message, error);
            this.store.setError(message);
        } finally {
            this.store.setLoading(false);
        }
    }

    /**
     * Loads articles filtered by category from the API and updates the store
     * @param category - The category slug to filter articles by
     * @returns Promise that resolves when articles are loaded
     */
    public async loadArticlesByCategory(category: string): Promise<void> {
        try {
            this.store.setLoading(true);
            this.store.setError(null);

            const articles: ArticleData[] = await this.api.getArticlesByCategory(category);
            // console.log('[SERVICE] - loadArticlesByCategory() ', articles);

            this.store.setArticles(articles);
        } catch (error) {
            const message = `Error loading articles for category ${category}`;
            console.error(message, error);
            this.store.setError(message);
        } finally {
            this.store.setLoading(false);
        }
    }

    /**
     * Loads a single article by its ID from the API and updates the store
     * @param articleId - The unique identifier of the article to load
     * @returns Promise that resolves when the article is loaded
     */
    public async loadArticleById(articleId: number): Promise<void> {
        try {
            this.store.setLoading(true);
            this.store.setError(null);

            const article: ArticleData = await this.api.getArticleById(articleId);
            // console.log('[SERVICE] - loadArticleById() ', article);

            this.store.setArticleById(article);
        } catch (error) {
            const message = `Error loading article ${articleId}`;
            console.error(message, error);
            this.store.setError(message);
        } finally {
            this.store.setLoading(false);
        }
    }

    /**
     * Loads a single article by its slug from the API and updates the store
     * @param articleSlug - The URL-friendly slug identifier of the article
     * @returns Promise that resolves when the article is loaded
     */
    public async loadArticleBySlug(articleSlug: string): Promise<void> {
        try {
            this.store.setLoading(true);
            this.store.setError(null);

            const article: ArticleData = await this.api.getArticleBySlug(articleSlug);
            // console.log('[SERVICE] - getArticleBySlug() ', article);

            this.store.setArticleById(article);
        } catch (error) {
            const message = `Error loading article ${articleSlug}`;
            console.error(message, error);
            this.store.setError(message);
        } finally {
            this.store.setLoading(false);
        }
    }

    /**
     * Selects an article in the store for display or editing
     * @param articleId - The ID of the article to select, or null to deselect
     */
    selectArticle(articleId: number | null): void {
        this.store.selectArticle(articleId);
    }

    /**
     * Clears all article data from the store
     * Resets articles, loading state, and errors
     */
    clearStore(): void {
        this.store.clearStore();
    }
}