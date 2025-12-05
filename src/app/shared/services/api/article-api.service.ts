import { Injectable, inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { ArticleData } from '@models/article.model';
import { CONTENT_API_URI } from '../../config-api';

/**
 * Article API Service for HTTP Operations
 *
 * This service handles all HTTP requests related to articles.
 * It retrieves articles from the content API with support for
 * authentication via session tokens stored in cookies.
 *
 * Features:
 * - Fetch all recent articles
 * - Filter articles by category
 * - Retrieve single article by ID or slug
 * - Automatic cookie-based authentication
 */
@Injectable({
    providedIn: 'root'
})
export class ArticleApiService {
    private readonly authService = inject(AuthService);

    /**
     * Retrieves the most recent articles from the server
     * Makes HTTP GET request with limit of 5 articles
     * Automatically includes authentication token from cookies if available
     * @returns {Promise<ArticleData[]>} Promise resolving to array of article data objects
     * @throws {Error} Throws error if HTTP request fails
     */
    public async getAllArticles(): Promise<ArticleData[]> {
        const headers = new Headers({ 'Content-Type': 'application/json' });

        // Retrieve token from cookie and add it to header
        const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('session_token='))
            ?.split('=')[1];

        if (token) {
            headers.append('Authorization', `Bearer ${token}`);
        }

        const response = await fetch(`${CONTENT_API_URI}/content/v1/public/last-articles?q=5`, {
            method: 'GET',
            headers,
            credentials: 'include'  // Send cookies automatically
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

        const data = await response.json();
        return Array.isArray(data) ? data : [];
    }







    /**
     * Retrieves articles filtered by category from the server
     * Makes HTTP GET request with category query parameter
     * @param {string} category - The category name to filter articles by
     * @returns {Promise<ArticleData[]>} Promise resolving to array of article data objects in the specified category
     * @throws {Error} Throws error if HTTP request fails
     */
    public async getArticlesByCategory(category: string): Promise<ArticleData[]> {
        const headers = new Headers({ 'Content-Type': 'application/json' });

        const response = await fetch(`${CONTENT_API_URI}/content/v1/public/articles?cat=${category}`, {
            method: 'GET',
            headers,
            credentials: 'include'  // Send cookies automatically
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

        const data = await response.json();
        return Array.isArray(data) ? data : [];
    }







    /**
     * Retrieves a single article by its numeric ID from the server
     * Makes HTTP GET request with article ID query parameter
     * @param {number} articleId - The numeric ID of the article to retrieve
     * @returns {Promise<ArticleData>} Promise resolving to single article data object
     * @throws {Error} Throws error if HTTP request fails or article not found
     */
    public async getArticleById(articleId: number): Promise<ArticleData> {
        const headers = new Headers({ 'Content-Type': 'application/json' });

        const response = await fetch(`${CONTENT_API_URI}/content/v1/public/article?id=${articleId}`, {
            method: 'GET',
            headers,
            credentials: 'include'  // Send cookies automatically
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

        const data = await response.json();
        return data;
    }

    /**
     * Retrieves a single article by its slug (URL-friendly identifier) from the server
     * Makes HTTP GET request with article slug query parameter
     * @param {string} articleSlug - The slug identifier of the article to retrieve
     * @returns {Promise<ArticleData>} Promise resolving to single article data object
     * @throws {Error} Throws error if HTTP request fails or article not found
     */
    public async getArticleBySlug(articleSlug: string): Promise<ArticleData> {
        const headers = new Headers({ 'Content-Type': 'application/json' });

        const response = await fetch(`${CONTENT_API_URI}/content/v1/public/article?slug=${articleSlug}`, {
            method: 'GET',
            headers,
            credentials: 'include'  // Send cookies automatically
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

        const data = await response.json();
        return data;
    }
}