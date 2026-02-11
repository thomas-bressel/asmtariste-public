// Angular imports
import { Component, inject, OnInit } from '@angular/core';

// Components imports
import { Folder } from "@components/ui/folder/folder";
import { Pricing } from '@components/ui/pricing/pricing';

// Services imports
import { FolderService } from '@services/folder.service';

// Config imports
import { CONTENT_API_URI, CONTENT_STATIC_IMAGES_URI } from 'src/app/shared/config-api';

/**
 * Folders section component that displays a collection of resource folders.
 *
 * This is an Angular standalone component that renders a section containing
 * multiple folder cards and pricing information. It loads folder data from
 * the FolderService on initialization and exposes signals for reactive template updates.
 *
 * @component
 * @standalone
 * @implements {OnInit}
 * @selector section[app-folders]
 * @example
 * <section app-folders></section>
 */
@Component({
  selector: 'section[app-folders]',
  imports: [Folder, Pricing],
  templateUrl: './folders.html',
  styleUrl: './folders.scss',
})
export class Folders implements OnInit {

  /**
   * Base URL for the content API.
   * @readonly
   */
  public readonly baseUrlAPI = CONTENT_API_URI;

  /**
   * Injected folder service for managing folder data.
   * @private
   * @readonly
   */
  private readonly folderService = inject(FolderService);

  /**
   * Signal containing the list of folders.
   * Exposed to template for reactive updates.
   * @readonly
   */
  public readonly folders = this.folderService.folders;

  /**
   * Signal indicating whether folders are currently being loaded.
   * @readonly
   */
  public readonly isLoading = this.folderService.loading;

  /**
   * Signal containing the currently selected folder.
   * @readonly
   */
  public readonly selectedFolder = this.folderService.selectedFolder;

  /**
   * Signal containing the total count of folders.
   * @readonly
   */
  public readonly foldersCount = this.folderService.foldersCount;


  /**
   * Initializes the component by loading folder data.
   *
   * Lifecycle hook that runs once after the component is initialized.
   * Triggers the folder service to load folders from the API.
   *
   * @async
   * @returns {Promise<void>} Promise that resolves when folders are loaded
   */
  async ngOnInit(): Promise<void> {
    await this.folderService.loadFolders()
  }
}