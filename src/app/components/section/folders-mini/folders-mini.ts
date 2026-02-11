import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FolderService } from '@services/folder.service';
import { ItemSelector } from '@services/selector.service';
import { AuthService } from '@services/auth.service';

import { CONTENT_API_URI, CONTENT_STATIC_IMAGES_URI } from 'src/app/shared/config-api';

/**
 * Mini folders sidebar component that provides quick navigation to folders.
 *
 * This is an Angular standalone component that renders a collapsible sidebar
 * with a list of active folders. It provides quick navigation and is only visible
 * to authenticated users. The panel can be toggled open/closed.
 *
 * @component
 * @standalone
 * @selector aside[app-folders-mini]
 * @example
 * <aside app-folders-mini></aside>
 */
@Component({
  selector: 'aside[app-folders-mini]',
  imports: [],
  templateUrl: './folders-mini.html',
  styleUrl: './folders-mini.scss',
  host: {
    'class': 'folders-mini',
    '[class.open]': 'isOpen()',
    '[class.hidden]': '!isAuthenticated()'
  }
})
export class FoldersMini {
  /**
   * Injected folder service for accessing folder data.
   * @private
   * @readonly
   */
  private readonly folderService = inject(FolderService);

  /**
   * Injected item selector service for managing selected items.
   * @private
   * @readonly
   */
  private readonly itemSelector = inject(ItemSelector);

  /**
   * Injected router for navigation.
   * @private
   * @readonly
   */
  private readonly router = inject(Router);

  /**
   * Injected authentication service for checking user authentication status.
   * @private
   * @readonly
   */
  private readonly auth = inject(AuthService);

  /**
   * Base URL for the content API.
   * @readonly
   */
  // public readonly baseUrlAPI = CONTENT_API_URI;
  public readonly baseUrlAPI = CONTENT_STATIC_IMAGES_URI;
  /**
   * Signal containing the list of active folders.
   * @readonly
   */
  public readonly folders = this.folderService.activeFolders;

  /**
   * Signal indicating whether the user is authenticated.
   * @readonly
   */
  public readonly isAuthenticated = this.auth.isAuthenticated;

  /**
   * Signal indicating whether the panel is open or closed.
   */
  public isOpen = signal<boolean>(false);

  /**
   * Toggles the panel open/closed state.
   *
   * @public
   * @returns {void}
   */
  public togglePanel(): void {
    this.isOpen.update(v => !v);
  }

  /**
   * Navigates to a specific folder page.
   *
   * Generates a URL-friendly slug from the folder name, updates the selected item,
   * navigates to the resources page for that folder, and closes the panel.
   *
   * @public
   * @param {number} folderId - The ID of the folder to navigate to
   * @param {string} folderName - The name of the folder used to generate the URL slug
   * @returns {void}
   */
  public navigateToFolder(folderId: number, folderName: string): void {
    const slug = this.generateSlug(folderName);
    this.itemSelector.selectItem(folderId, slug);
    this.router.navigate(['/ressources', slug]);
    this.isOpen.set(false);
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