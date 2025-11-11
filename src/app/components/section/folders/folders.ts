import { Component, signal } from '@angular/core';
import { Folder } from "@components/ui/folder/folder";

import { colorIcons } from 'src/app/shared/icons/icons-library';

@Component({
  selector: 'section[app-folders]',
  imports: [Folder],
  templateUrl: './folders.html',
  styleUrl: './folders.scss',
})
export class Folders {

  public colorIcons: any = colorIcons;

  public activeTab = signal<string>('freemium');

  public setActiveTab(tab: string): void {
    this.activeTab.set(tab);
  }

}
