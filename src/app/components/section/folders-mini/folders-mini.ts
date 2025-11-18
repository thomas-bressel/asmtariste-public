import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FolderService } from '@services/folder.service';
import { ItemSelector } from '@services/selector.service';
import { AuthService } from '@services/auth.service';

import { CONTENT_API_URI } from 'src/app/shared/config-api';

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
  private readonly folderService = inject(FolderService);
  private readonly itemSelector = inject(ItemSelector);
  private readonly router = inject(Router);
    private readonly auth = inject(AuthService);


  public readonly baseUrlAPI = CONTENT_API_URI;
  public readonly folders = this.folderService.activeFolders;
    public readonly isAuthenticated = this.auth.isAuthenticated;

  public isOpen = signal<boolean>(false);

  public togglePanel(): void {
    this.isOpen.update(v => !v);
  }

  public navigateToFolder(folderId: number, folderName: string): void {
    const slug = this.generateSlug(folderName);
    this.itemSelector.selectItem(folderId, slug);
    this.router.navigate(['/ressources', slug]);
    this.isOpen.set(false);
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}