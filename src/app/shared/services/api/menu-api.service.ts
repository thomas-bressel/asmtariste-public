import { Injectable, inject } from '@angular/core';
import { MenuData } from '@models/menu.model';
import { CONTENT_API_URI, PROJECT_ID } from '../../config-api';
import { AuthApi } from './auth-api.service';

/**
 * Menu API Service for HTTP Operations
 *
 * This service handles all HTTP requests related to the header menu.
 * It retrieves menu tiems from the content API with support for
 * authentication via session tokens stored in cookies.
 *
 * Features:
 * - Fetch all menu items
 */
@Injectable({
    providedIn: 'root'
})
export class MenuApiService {
    private readonly authApi = inject(AuthApi);

    /**
     * Retrieves menu items from the server
     * @returns {Promise<MenuData[]>} Promise resolving to array of menu item data objects
     * @throws {Error} Throws error if HTTP request fails
     */
    public async getHeaderMenu(): Promise<MenuData[]> {
        const response = await this.authApi.fetchWithAuth(`${CONTENT_API_URI}/content/v1/public/menu`, {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

        const data = await response.json();
            console.log('Header menu:', data)
        return Array.isArray(data) ? data : [];
    }

}