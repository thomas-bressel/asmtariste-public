import { Component, input, inject, signal } from '@angular/core';

import { CONTENT_API_URI } from 'src/app/shared/config-api';

import { ItemSelector } from '@services/selector.service';
import { FileService } from '@services/file.service';

/**
 * File item component for displaying downloadable file information.
 *
 * This is an Angular standalone component that renders a file item card
 * with metadata such as name, description, label, and access level.
 * It provides functionality to download files based on user access level.
 *
 * @component
 * @standalone
 * @selector article[app-file-item]
 * @example
 * <article app-file-item
 *          [name]="'Document.pdf'"
 *          [levelRequired]="1"
 *          [id_file]="123">
 * </article>
 */
@Component({
  selector: 'article[app-file-item]',
  imports: [],
  templateUrl: './file-item.html',
  styleUrl: './file-item.scss',
  host: {
    'class': 'file-item'
  }
})
export class FileItem {

  /**
   * Base URL for the content API.
   * @public
   */
  public baseUrl: string = CONTENT_API_URI;

  /**
   * Injected item selector service for managing selected items.
   * @public
   */
  public ItemSelector = inject(ItemSelector);

  /**
   * Injected file service for handling file operations.
   * @readonly
   */
  readonly serviceFile: FileService = inject(FileService);

  /**
   * Signal containing the ID of the parent folder.
   */
  public id_folder = signal(this.ItemSelector.selectedItemId());

  /**
   * Unique identifier for the file.
   * @input
   */
  public id_file = input<number>(0);

  /**
   * Name of the file.
   * @input
   */
  public name = input<string>('');

  /**
   * Description of the file.
   * @input
   */
  public description = input<string>('');

  /**
   * Label category ID for the file.
   * @input
   */
  public id_label = input<number>(0);

  /**
   * Label text for the file category.
   * @input
   */
  public label = input<string>('');

  /**
   * Required access level to download the file (0 = Free, 1 = Freemium, 2+ = Premium).
   * @input
   */
  public levelRequired = input<number>(0);

  /**
   * Gets the localized badge text for the access level.
   *
   * @public
   * @returns {string} Badge text: 'Gratuit' (Free), 'Freemium', or 'Premium'
   */
  public getLevelBadge(): string {
    const level = this.levelRequired();
    if (level === 0) return 'Gratuit';
    if (level === 1) return 'Freemium';
    return 'Premium';
  }

  /**
   * Gets the CSS color class for the access level badge.
   *
   * @public
   * @returns {string} CSS class: 'free', 'freemium', or 'premium'
   */
  public getLevelColor(): string {
    const level = this.levelRequired();
    if (level === 0) return 'free';
    if (level === 1) return 'freemium';
    return 'premium';
  }

  /**
   * Handles file download request.
   *
   * Triggers the file service to download the specified file.
   * Access control is handled by the file service.
   *
   * @public
   * @param {number} fileId - The ID of the file to download
   * @returns {void}
   */
  handleDownloadFile(fileId: number): void {
    this.serviceFile.downloadFile(fileId);
  }
}