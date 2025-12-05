import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FileService } from '@services/file.service';
import { FolderService } from '@services/folder.service';
import { ItemSelector } from '@services/selector.service';
import { SeoService } from '@services/seo.service';
import { FileItem } from '@components/ui/file-item/file-item';

/**
 * Resources page component for displaying downloadable files organized by folder.
 * Route: /ressources/:slug
 *
 * @component
 * @description Displays files grouped by category within a selected resource folder.
 * Loads folder information and files from FolderService and FileService based on the
 * folder ID stored in ItemSelector. Provides functionality to expand/collapse file groups.
 */
@Component({
  selector: 'main[app-ressources]',
  imports: [FileItem],
  templateUrl: './ressources.html',
  styleUrl: './ressources.scss'
})
export class Ressources implements OnInit, OnDestroy {
  /**
   * Activated route for accessing URL parameters.
   * @private
   * @readonly
   * @type {ActivatedRoute}
   */
  private readonly route = inject(ActivatedRoute);

  /**
   * Angular router for navigation.
   * @private
   * @readonly
   * @type {Router}
   */
  private readonly router = inject(Router);

  /**
   * File service for fetching and managing files.
   * @private
   * @readonly
   * @type {FileService}
   */
  private readonly fileService = inject(FileService);

  /**
   * Folder service for accessing folder information.
   * @private
   * @readonly
   * @type {FolderService}
   */
  private readonly folderService = inject(FolderService);

  /**
   * Item selector service for managing selected folder state.
   * @private
   * @readonly
   * @type {ItemSelector}
   */
  private readonly itemSelector = inject(ItemSelector);

  /**
   * SEO service for managing page metadata.
   * @private
   * @readonly
   * @type {SeoService}
   */
  private readonly seo = inject(SeoService);

  /**
   * Signal containing files grouped by category.
   * @public
   * @readonly
   */
  public readonly groupedFiles = this.fileService.groupedFiles;

  /**
   * Signal indicating whether files are currently loading.
   * @public
   * @readonly
   */
  public readonly isLoading = this.fileService.loading;

  /**
   * Signal containing any errors from file loading.
   * @public
   * @readonly
   */
  public readonly error = this.fileService.error;

  /**
   * Name of the current resource folder.
   * @public
   * @type {string}
   */
  public folderName = '';

  /**
   * Description of the current resource folder.
   * @public
   * @type {string}
   */
  public folderDescription = '';






  /**
   * Lifecycle hook that is called after component initialization.
   * Subscribes to route parameters to load folder data based on slug and folder ID.
   * Redirects to homepage if slug or folder ID is missing.
   *
   * @returns {Promise<void>}
   */
  async ngOnInit(): Promise<void> {
    this.route.paramMap.subscribe(async (params) => {
      const slug = params.get('slug');

      if (!slug) {
        this.router.navigate(['/accueil']);
        return;
      }

      const folderId = this.itemSelector.selectedItemId();

      if (!folderId) {
        this.router.navigate(['/accueil']);
        return;
      }

      await this.loadFolderData(folderId);
    });
  }






  /**
   * Loads folder data and files for the specified folder ID.
   * Fetches files via FileService and retrieves folder metadata from FolderService.
   * Updates SEO metadata with folder-specific information.
   *
   * @private
   * @param {number} folderId - The ID of the folder to load
   * @returns {Promise<void>}
   */
  private async loadFolderData(folderId: number): Promise<void> {
    await this.fileService.loadFilesByFolder(folderId);

    const folder = this.folderService.folders().find(f => f.id_folder === folderId);
    if (folder) {
      this.folderName = folder.title;
      this.folderDescription = folder.description;
    }

    this.seo.updateSeo({
      title: `${this.folderName} - Ressources ASMtariste`,
      description: this.folderDescription,
      keywords: 'ressources, fichiers, Atari ST, téléchargement',
      image: 'https://asmtariste.fr/assets/home-og.jpg'
    });
  }






  /**
   * Lifecycle hook that is called when the component is destroyed.
   * Clears the file store to clean up component state.
   *
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.fileService.clearStore();
  }






  /**
   * Navigates back to the homepage.
   *
   * @public
   * @returns {void}
   */
  public goBack(): void {
    this.router.navigate(['/accueil']);
  }






  /**
   * Toggles the expand/collapse state of a file group.
   *
   * @public
   * @param {string} label - The label of the group to toggle
   * @returns {void}
   */
  public toggleGroup(label: string): void {
    this.fileService.toggleGroup(label);
  }






  /**
   * Checks if a file group is currently expanded.
   *
   * @public
   * @param {string} label - The label of the group to check
   * @returns {boolean} True if the group is expanded, false otherwise
   */
  public isGroupOpen(label: string): boolean {
    return this.fileService.isGroupOpen(label);
  }
}