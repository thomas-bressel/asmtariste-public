import { Injectable, inject } from '@angular/core';
import { MenuApiService } from '@services/api/menu-api.service';
import { MenuStore } from '@services/store/menu-store.service';
import { MenuData } from '@models/menu.model';

/**
 * MENU FACADE SERVICE - Orchestration Layer
 *
 * Orchestrates menus-related operations by coordinating between API and store services.
 * Provides a unified interface for components to manage menu items data.
 */
@Injectable({
    providedIn: 'root'
})
export class MenuService {
    private readonly api = inject(MenuApiService);
    private readonly store = inject(MenuStore);

    /** Signal containing all menu items */
    readonly menus = this.store.menus;
    /** Signal indicating if articles are being loaded */
    readonly loading = this.store.loading;
    /** Signal containing any error message */
    readonly error = this.store.error;

    /**
     * Loads all menu items from the API and updates the store
     * Sets loading state and handles errors appropriately
     * @returns Promise that resolves when items are loaded
     */
    public async loadHeaderMenu(): Promise<void> {
        try {
            this.store.setLoading(true);
            this.store.setError(null);

            const menus: MenuData[] = await this.api.getHeaderMenu();
            // console.log('[SERVICE] - loadArticles() ', articles);

            this.store.setMenus(menus);
        } catch (error) {
            const message = 'Error loading menus';
            console.error(message, error);
            this.store.setError(message);
        } finally {
            this.store.setLoading(false);
        }
    }

    /**
     * Clears all article data from the store
     * Resets articles, loading state, and errors
     */
    clearStore(): void {
        this.store.clearStore();
    }
}