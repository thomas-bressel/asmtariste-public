import { Component, input, computed, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'; 

@Component({
  selector: 'li[app-folder]',
  templateUrl: './folder.html',
  styleUrl: './folder.scss',
  host: {
    'class': 'card',
  }
})
export class Folder {
  private sanitizer = inject(DomSanitizer);

  public icon = input<string>('');
  public name = input<string>('');
  public desc = input<string>('');

  public safeIcon = computed<SafeHtml>(() => {
    const rawIcon = this.icon();
    if (rawIcon) return this.sanitizer.bypassSecurityTrustHtml(rawIcon);
    return '';
  });
}