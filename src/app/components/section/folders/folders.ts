// Angular imports
import { Component, inject, OnInit } from '@angular/core';

// Components imports
import { Folder } from "@components/ui/folder/folder";
import { Pricing } from '@components/ui/pricing/pricing';

// Services imports
import { FolderService } from '@services/folder.service';

// Config imports
import { CONTENT_API_URI } from 'src/app/shared/config-api';


@Component({
  selector: 'section[app-folders]',
  imports: [Folder, Pricing],
  templateUrl: './folders.html',
  styleUrl: './folders.scss',
})
export class Folders implements OnInit {

  // Configuration API
  public readonly baseUrlAPI = CONTENT_API_URI;

  // Dependencies injection
  private readonly folderService = inject(FolderService);

  // Facade signals properties exposed to template 
  public readonly folders = this.folderService.folders;
  public readonly isLoading = this.folderService.loading;
  public readonly selectedFolder = this.folderService.selectedFolder;
  public readonly foldersCount = this.folderService.foldersCount;


  /**
   * Component initialization
   */
  async ngOnInit(): Promise<void> {
    // Load folders data from the service
    await this.folderService.loadFolders()
  }
}