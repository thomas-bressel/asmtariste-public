import { Injectable, signal } from '@angular/core';
import { MenuData } from '@models/menu.model';

/**
 * MENU STORE SERVICE - Pure State Management for Header menus
 *
 * This store service manages menu states using Angular Signals.
 * It is a pure state management service with NO side effects or API calls.
 *
 * RULES:
 * - NEVER call APIs directly
 * - Only manage state and expose signals
 * - Called EXCLUSIVELY by the facade service
 *
 * @remarks
 * This service provides read-only signals for items menu,
 * along with computed signals for derived state like displayed article.
 */
@Injectable({
  providedIn: 'root'
})
export class MenuStore {
  // ===== PRIVATE STATE =====
  /**
   * Private writable signal containing the array of all item menu
   */
  private readonly _menus = signal<MenuData[]>([]);

  /**
   * Private writable signal for loading state
   */
  private readonly _loading = signal(false);

  /**
   * Private writable signal for error messages
   */
  private readonly _error = signal<string | null>(null);


  // ===== PUBLIC READ-ONLY SIGNALS =====
  /**
   * Read-only signal exposing the articles array
   */
  readonly menus = this._menus.asReadonly();

  /**
   * Read-only signal exposing the loading state
   */
  readonly loading = this._loading.asReadonly();

  /**
   * Read-only signal exposing error messages
   */
  readonly error = this._error.asReadonly();

  // ===== STATE MUTATIONS =====
  /**
   * Sets the menus array and clears any existing errors
   * @param menus - Array of menu items data to store
   */
  setMenus(menus: MenuData[]): void {
    this._menus.set(menus);
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
   * Clears all store data and resets to initial state
   */
  clearStore(): void {
    this._menus.set([]);
    this._loading.set(false);
    this._error.set(null);
  }
}