import { Component, input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ItemSelector } from '@services/selector.service';
import { CONTENT_API_URI } from 'src/app/shared/config-api';

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
  public readonly baseUrlAPI = CONTENT_API_URI;
  private readonly router = inject(Router);
  private readonly itemSelector = inject(ItemSelector);

  public id = input<number>(0);
  public icon = input<string>('');
  public name = input<string>('');
  public desc = input<string>('');



  /**
   * 
   */
  public navigateToRessources(): void {
    const slug = this.generateSlug(this.name());
    this.itemSelector.selectItem(this.id(), slug);
    this.router.navigate(['/ressources', slug]);
  }






  /**
   * 
   * @param name 
   * @returns 
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