// Angular imports
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Components imports
import { Card } from "@components/ui/card/card";

// Service imports
import { ArticleService } from '@services/article.service';

// Config imports
import { CONTENT_API_URI, CONTENT_STATIC_IMAGES_URI } from 'src/app/shared/config-api';

/**
 * Last articles section component that displays the most recent articles.
 *
 * This is an Angular standalone component that renders a section containing
 * cards for the latest articles. It loads article data on initialization and
 * provides navigation functionality to individual article pages.
 *
 * @component
 * @standalone
 * @implements {OnInit}
 * @selector section[app-last-articles]
 * @example
 * <section app-last-articles></section>
 */
@Component({
  selector: 'section[app-last-articles]',
  imports: [Card],
  templateUrl: './last-articles.html',
  styleUrl: './last-articles.scss',
  host: {
    'class': 'section'
  }
})
export class LastArticles implements OnInit {

  /**
   * Base URL for the content API.
   * @readonly
   */
  // public readonly baseUrlAPI = CONTENT_API_URI;
    // public readonly baseUrlAPI = CONTENT_API_URI;
  public readonly baseUrlAPI = CONTENT_STATIC_IMAGES_URI;
  /**
   * Injected router for navigation.
   * @private
   * @readonly
   */
  private readonly route = inject(Router);

  /**
   * Injected article service for managing article data.
   * @private
   * @readonly
   */
  private readonly articleService = inject(ArticleService);

  /**
   * Signal containing the list of articles.
   * Exposed to template for reactive updates.
   * @readonly
   */
  public readonly articles = this.articleService.articles;

  /**
   * Signal indicating whether articles are currently being loaded.
   * @readonly
   */
  public readonly isLoading = this.articleService.loading;

  /**
   * Signal containing the currently selected article.
   * @readonly
   */
  public readonly selectedArticle = this.articleService.selectedArticle;

  /**
   * Signal containing the total count of articles.
   * @readonly
   */
  public readonly articlesCount = this.articleService.articlesCount;

  /**
   * Initializes the component by loading article data.
   *
   * Lifecycle hook that runs once after the component is initialized.
   * Triggers the article service to load articles from the API.
   *
   * @async
   * @returns {Promise<void>} Promise that resolves when articles are loaded
   */
  async ngOnInit(): Promise<void> {
    await this.articleService.loadArticles();
  }

  /**
   * Handles navigation to an article detail page.
   *
   * Normalizes the category slug (converting French characters) and navigates
   * to the article page using the category and article slug.
   *
   * @public
   * @param {string} category - The article category
   * @param {string} slug - The article URL slug
   * @param {Event} event - The click event
   * @returns {void}
   */
  public handleNavigate(category: string, slug: string, event: Event) {
    let category_slug = category;

    if (category === "actualité")  category_slug = "actualite"

   this.route.navigate([`./${category_slug}/article/${slug}`])
  }

}
