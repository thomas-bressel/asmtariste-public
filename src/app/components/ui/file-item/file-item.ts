import { Component, input, inject, signal } from '@angular/core';

import { CONTENT_API_URI } from 'src/app/shared/config-api';

import { ItemSelector } from '@services/selector.service';
import { FileService } from '@services/file.service';

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

  public baseUrl: string = CONTENT_API_URI;
public ItemSelector = inject(ItemSelector);
readonly serviceFile: FileService = inject(FileService);

public id_folder = signal(this.ItemSelector.selectedItemId());

  public id_file = input<number>(0);
  public name = input<string>('');
  public id_label = input<number>(0);
  public label = input<string>('');
  public levelRequired = input<number>(0);



  public getLevelBadge(): string {
    const level = this.levelRequired();
    if (level === 0) return 'Gratuit';
    if (level === 1) return 'Freemium';
    return 'Premium';
  }

  public getLevelColor(): string {
    const level = this.levelRequired();
    if (level === 0) return 'free';
    if (level === 1) return 'freemium';
    return 'premium';
  }






  handleDownloadFile(fileId: number): void {
    this.serviceFile.downloadFile(fileId);
  }
}