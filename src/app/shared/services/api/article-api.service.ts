import { Injectable, inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { ArticleData } from '@models/article.model';
import { CONTENT_API_URI } from '../../config-api';

@Injectable({
    providedIn: 'root'
})
export class ArticleApiService {
    private readonly authService = inject(AuthService);

    /**
     * Retrieves all articles from the server
     */
    public async getAllArticles(): Promise<ArticleData[]> {
        const response = await fetch(`${CONTENT_API_URI}/content/v1/public/last-articles?q=5`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${this.authService.sessionToken()}`
            }
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

        const data = await response.json();
        return Array.isArray(data) ? data : [];
    }

    /**
     * Retrieves articles by category from the server
     */
    public async getArticlesByCategory(category: string): Promise<ArticleData[]> {
        const response = await fetch(`${CONTENT_API_URI}/content/v1/public/articles?cat=${category}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${this.authService.sessionToken()}`
            }
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

        const data = await response.json();
        return Array.isArray(data) ? data : [];
    }

    /**
     * Retrieves a single article by ID from the server
     */
    public async getArticleById(articleId: number): Promise<ArticleData> {
        const response = await fetch(`${CONTENT_API_URI}/content/v1/public/article?id=${articleId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${this.authService.sessionToken()}`
            }
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

        const data = await response.json();
        return data;
    }
    /**
     * Retrieves a single article by ID from the server
     */
    public async getArticleBySlug(articleSlug: string): Promise<ArticleData> {
        const response = await fetch(`${CONTENT_API_URI}/content/v1/public/article?slug=${articleSlug}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${this.authService.sessionToken()}`
            }
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

        const data = await response.json();
        return data;
    }
}