import { Component, input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ItemSelector } from '@services/selector.service';
import { CONTENT_API_URI, CONTENT_STATIC_IMAGES_URI } from 'src/app/shared/config-api';

/**
 * Folder card component for displaying and navigating to resource folders.
 *
 * This is an Angular standalone component that renders a clickable folder card.
 * When clicked, it navigates to the resources page for that folder and updates
 * the selected item state.
 *
 * @component
 * @standalone
 * @selector li[app-folder]
 * @example
 * <li app-folder
 *     [id]="123"
 *     [name]="'My Folder'"
 *     [desc]="'Folder description'"
 *     [icon]="'folder-icon.png'">
 * </li>
 */
@Component({
  selector: 'li[app-folder]',
  templateUrl: './folder.html',
  styleUrl: './folder.scss',
  host: {
    'class': 'card',
    '(click)': 'navigateToRessources()'
  }
})
export class Folder {
  /**
   * Base URL for the content API.
   * @readonly
   */
  // public readonly baseUrlAPI = CONTENT_API_URI;
  public readonly baseUrlAPI = CONTENT_STATIC_IMAGES_URI;
  /**
   * Injected router for navigation.
   * @private
   * @readonly
   */
  private readonly router = inject(Router);

  /**
   * Injected item selector service for managing selected items.
   * @private
   * @readonly
   */
  private readonly itemSelector = inject(ItemSelector);

  /**
   * Unique identifier for the folder.
   * @input
   */
  public id = input<number>(0);

  /**
   * URL or path to the folder icon.
   * @input
   */
  public icon = input<string>('');

  /**
   * Name of the folder.
   * @input
   */
  public name = input<string>('');

  /**
   * Description of the folder.
   * @input
   */
  public desc = input<string>('');

  /**
   * Navigates to the resources page for this folder.
   *
   * Generates a URL-friendly slug from the folder name, updates the selected
   * item in the item selector service, and navigates to the resources route.
   *
   * @public
   * @returns {void}
   */
  public navigateToRessources(): void {
    const slug = this.generateSlug(this.name());
    this.itemSelector.selectItem(this.id(), slug);
    this.router.navigate(['/ressources', slug]);
  }

  /**
   * Generates a URL-friendly slug from a folder name.
   *
   * Converts the name to lowercase, normalizes Unicode characters,
   * removes diacritics, replaces non-alphanumeric characters with hyphens,
   * and trims leading/trailing hyphens.
   *
   * @private
   * @param {string} name - The folder name to convert
   * @returns {string} The generated URL-friendly slug
   */
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}