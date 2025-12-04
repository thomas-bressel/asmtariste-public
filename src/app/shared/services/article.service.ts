import { Injectable, inject } from '@angular/core';
import { ArticleApiService } from '@services/api/article-api.service';
import { ArticleStore } from '@services/store/article-store.service';
import { ArticleData } from '@models/article.model';

@Injectable({
    providedIn: 'root'
})
export class ArticleService {
    private readonly api = inject(ArticleApiService);
    private readonly store = inject(ArticleStore);

    readonly articles = this.store.articles;
    readonly articleById = this.store.articleById;
    readonly loading = this.store.loading;
    readonly error = this.store.error;
    readonly selectedArticle = this.store.selectedArticle;
    readonly articlesCount = this.store.articlesCount;

    /**
     * Loads all articles from API and updates the store
     */
    public async loadArticles(): Promise<void> {
        try {
            this.store.setLoading(true);
            this.store.setError(null);

            const articles: ArticleData[] = await this.api.getAllArticles();
            // console.log('[SERVICE] - loadArticles() ', articles);

            this.store.setArticles(articles);
        } catch (error) {
            const message = 'Erreur lors du chargement des articles';
            console.error(message, error);
            this.store.setError(message);
        } finally {
            this.store.setLoading(false);
        }
    }

    /**
     * Loads articles by category from API and updates the store
     */
    public async loadArticlesByCategory(category: string): Promise<void> {
        try {
            this.store.setLoading(true);
            this.store.setError(null);

            const articles: ArticleData[] = await this.api.getArticlesByCategory(category);
            // console.log('[SERVICE] - loadArticlesByCategory() ', articles);

            this.store.setArticles(articles);
        } catch (error) {
            const message = `Erreur lors du chargement des articles de la catégorie ${category}`;
            console.error(message, error);
            this.store.setError(message);
        } finally {
            this.store.setLoading(false);
        }
    }

    /**
     * Loads a single article by ID from API and updates the store
     */
    public async loadArticleById(articleId: number): Promise<void> {
        try {
            this.store.setLoading(true);
            this.store.setError(null);

            const article: ArticleData = await this.api.getArticleById(articleId);
            // console.log('[SERVICE] - loadArticleById() ', article);

            this.store.setArticleById(article);
        } catch (error) {
            const message = `Erreur lors du chargement de l'article ${articleId}`;
            console.error(message, error);
            this.store.setError(message);
        } finally {
            this.store.setLoading(false);
        }
    }

    /**
     * Loads a single article by ID from API and updates the store
     */
    public async loadArticleBySlug(articleSlug: string): Promise<void> {
        try {
            this.store.setLoading(true);
            this.store.setError(null);

            const article: ArticleData = await this.api.getArticleBySlug(articleSlug);
            // console.log('[SERVICE] - getArticleBySlug() ', article);

            this.store.setArticleById(article);
        } catch (error) {
            const message = `Erreur lors du chargement de l'article ${articleSlug}`;
            console.error(message, error);
            this.store.setError(message);
        } finally {
            this.store.setLoading(false);
        }
    }

    /**
     * Selects an article by its ID
     */
    selectArticle(articleId: number | null): void {
        this.store.selectArticle(articleId);
    }

    /**
     * Clears the article store
     */
    clearStore(): void {
        this.store.clearStore();
    }
}