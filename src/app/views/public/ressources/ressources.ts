import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FileService } from '@services/file.service';
import { FolderService } from '@services/folder.service';
import { ItemSelector } from '@services/selector.service';
import { SeoService } from '@services/seo.service';
import { FileItem } from '@components/ui/file-item/file-item';

@Component({
  selector: 'main[app-ressources]',
  imports: [FileItem],
  templateUrl: './ressources.html',
  styleUrl: './ressources.scss'
})
export class Ressources implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fileService = inject(FileService);
  private readonly folderService = inject(FolderService);
  private readonly itemSelector = inject(ItemSelector);
  private readonly seo = inject(SeoService);

  public readonly groupedFiles = this.fileService.groupedFiles;
  public readonly isLoading = this.fileService.loading;
  public readonly error = this.fileService.error;

  public folderName = '';
  public folderDescription = '';






  /**
   * 
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
   * 
   * @param folderId 
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
   * 
   */
  ngOnDestroy(): void {
    this.fileService.clearStore();
  }






  /**
   * 
   */
  public goBack(): void {
    this.router.navigate(['/accueil']);
  }






  /**
   * 
   */
  public toggleGroup(label: string): void {
    this.fileService.toggleGroup(label);
  }






  /**
   * 
   */
  public isGroupOpen(label: string): boolean {
    return this.fileService.isGroupOpen(label);
  }
}