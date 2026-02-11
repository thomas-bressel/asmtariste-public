import { Component, signal, input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TagData } from '@models/tag.model';

// Config imports
import { CONTENT_API_URI, CONTENT_STATIC_IMAGES_URI } from 'src/app/shared/config-api';

/**
 * Article card component for displaying article summaries.
 *
 * This is an Angular standalone component that renders an article card
 * with customizable styling variants. It displays article metadata including
 * cover image, title, description, category, dates, and tags.
 *
 * @component
 * @standalone
 * @selector article[app-card]
 */
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

  /**
   * Base URL for the content API.
   * @readonly
   */
  // public readonly baseUrlAPI = CONTENT_API_URI;
  public readonly baseUrlAPI = CONTENT_STATIC_IMAGES_URI;

  /**
   * Style variant for the card based on parent component context.
   * Determines which stylesheet styling to apply.
   * @input
   * @default 'other-view'
   */
  public variantStyleSheet = input<'home-view' | 'other-view'>('other-view');

  /**
   * Signal controlling article visibility for animations.
   */
  public isArticleVisible = signal<boolean>(true);

  /**
   * Category name of the article.
   * @input
   */
  public category_name = input<string>('');

  /**
   * URL or path to the article cover image.
   * @input
   */
  public cover = input<string>('');

  /**
   * Unique identifier for the article.
   * @input
   */
  public id_articles = input<number>(0);

  /**
   * Article creation date.
   * @input
   */
  public creation_date = input<string>();

  /**
   * Article last update date.
   * @input
   */
  public update_date = input<string>();

  /**
   * Article title.
   * @input
   */
  public title = input<string>('');

  /**
   * Article description or excerpt.
   * @input
   */
  public description = input<string>('');

  /**
   * Array of tags associated with the article.
   * @input
   */
  public tags = input<TagData[] | undefined>([]);

}
