import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ItemSelector {
  private readonly _selectedItemId = signal<number | null>(null);
  private readonly _selectedItemSlug = signal<string | null>(null);

  readonly selectedItemId = this._selectedItemId.asReadonly();
  readonly selectedItemSlug = this._selectedItemSlug.asReadonly();

  selectItem(id: number, slug: string): void {
    this._selectedItemId.set(id);
    this._selectedItemSlug.set(slug);
  }

  clearSelection(): void {
    this._selectedItemId.set(null);
    this._selectedItemSlug.set(null);
  }
}