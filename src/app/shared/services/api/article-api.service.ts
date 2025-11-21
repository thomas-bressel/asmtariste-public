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
        const headers = new Headers({ 'Content-Type': 'application/json' });

        // Récupérer le token depuis le cookie et l'ajouter au header
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
            credentials: 'include'  // Envoie les cookies automatiquement
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

        const data = await response.json();
        return Array.isArray(data) ? data : [];
    }





    

    /**
     * Retrieves articles by category from the server
     */
    public async getArticlesByCategory(category: string): Promise<ArticleData[]> {
        const headers = new Headers({ 'Content-Type': 'application/json' });

        const response = await fetch(`${CONTENT_API_URI}/content/v1/public/articles?cat=${category}`, {
            method: 'GET',
            headers,
            credentials: 'include'  // Envoie les cookies automatiquement
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

        const data = await response.json();
        return Array.isArray(data) ? data : [];
    }





    

    /**
     * Retrieves a single article by ID from the server
     */
    public async getArticleById(articleId: number): Promise<ArticleData> {
        const headers = new Headers({ 'Content-Type': 'application/json' });

        const response = await fetch(`${CONTENT_API_URI}/content/v1/public/article?id=${articleId}`, {
            method: 'GET',
            headers,
            credentials: 'include'  // Envoie les cookies automatiquement
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

        const data = await response.json();
        return data;
    }





    
    /**
     * Retrieves a single article by ID from the server
     */
    public async getArticleBySlug(articleSlug: string): Promise<ArticleData> {
        const headers = new Headers({ 'Content-Type': 'application/json' });

        const response = await fetch(`${CONTENT_API_URI}/content/v1/public/article?slug=${articleSlug}`, {
            method: 'GET',
            headers,
            credentials: 'include'  // Envoie les cookies automatiquement
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

        const data = await response.json();
        return data;
    }
}