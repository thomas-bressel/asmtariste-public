import { Injectable, signal } from '@angular/core';

/**
 * ITEM SELECTOR SERVICE - Selection State Management
 *
 * Manages the currently selected item state across the application.
 * Tracks both ID and slug for the selected item using signals.
 * Used for coordinating item selection across multiple components.
 */
@Injectable({
  providedIn: 'root'
})
export class ItemSelector {
  private readonly _selectedItemId = signal<number | null>(null);
  private readonly _selectedItemSlug = signal<string | null>(null);

  /** Signal containing the ID of the currently selected item (read-only) */
  readonly selectedItemId = this._selectedItemId.asReadonly();
  /** Signal containing the slug of the currently selected item (read-only) */
  readonly selectedItemSlug = this._selectedItemSlug.asReadonly();

  /**
   * Selects an item by setting both its ID and slug
   * Updates both selection signals simultaneously
   * @param id - The numeric ID of the item to select
   * @param slug - The URL-friendly slug of the item to select
   */
  selectItem(id: number, slug: string): void {
    this._selectedItemId.set(id);
    this._selectedItemSlug.set(slug);
  }

  /**
   * Clears the current item selection
   * Resets both ID and slug to null
   */
  clearSelection(): void {
    this._selectedItemId.set(null);
    this._selectedItemSlug.set(null);
  }
}