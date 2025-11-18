import { Component, signal, input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TagData } from '@models/tag.model';


// Config imports
import { CONTENT_API_URI } from 'src/app/shared/config-api';
@Component({
  selector: 'article[app-card]',
  imports: [CommonModule],
  templateUrl: './card.html',
  styleUrl: './card.scss',
  host: {
    'class': 'article fade-in index2',
    '[class.visible]': 'isArticleVisible()',
    '[class.home-variant]': 'variantStyleSheet() === "home-view"',
    '[class.other-variant]': 'variantStyleSheet() === "other-view"',
  }
})
export class Card {

  // Configuration API
  public readonly baseUrlAPI = CONTENT_API_URI;


  // To switch style sheet depending of the parent component
  public variantStyleSheet = input<'home-view' | 'other-view'>('other-view');


  public isArticleVisible = signal<boolean>(true);

  public category_name = input<string>('');
  public cover = input<string>('');
  public id_articles = input<number>(0);
  public creation_date = input<string>();
  public update_date = input<string>();
  public title = input<string>('');
  public description = input<string>('');
  public tags = input<TagData[] | undefined>([]);




}
