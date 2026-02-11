import { Component, inject, OnInit, OnDestroy, signal, computed, effect, Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ItemSelector } from '@services/selector.service';
import { ContentService } from '@services/content.service';
import { ArticleService } from '@services/article.service';
import { PaginationService } from '@services/ui/pagination.service';

import { PaginationComponent } from '@components/ui/pagination/pagination';

import { CONTENT_API_URI, CONTENT_STATIC_IMAGES_URI } from 'src/app/shared/config-api';

/**
 * Article detail page component for displaying individual articles.
 * Route: /[category]/article/:slug (e.g., /actualite/article/my-article)
 *
 * @component
 * @description Displays a single article with its content organized in pages.
 * Loads article data and content by slug from ArticleService and ContentService.
 * Supports paginated content navigation using PaginationService.
 */
@Component({
  selector: 'app-article',
  imports: [CommonModule, PaginationComponent],
  templateUrl: './article.html',
  styleUrl: './article.scss',
})
export class Article implements OnInit, OnDestroy {
  /**
   * Angular injector for managing effects.
   * @private
   * @readonly
   * @type {Injector}
   */
  private readonly injector = inject(Injector);

  /**
   * Activated route for accessing URL parameters.
   * @private
   * @type {ActivatedRoute}
   */
  private route = inject(ActivatedRoute);

  /**
   * Item selector service for managing selected article state.
   * @private
   * @type {ItemSelector}
   */
  private selectorService = inject(ItemSelector);

  /**
   * Content service for fetching article content pages.
   * @private
   * @type {ContentService}
   */
  private contentService = inject(ContentService);

  /**
   * Article service for fetching article metadata.
   * @private
   * @type {ArticleService}
   */
  private articleService = inject(ArticleService);

  /**
   * Pagination service for managing page navigation.
   * @private
   * @type {PaginationService}
   */
  private paginationService = inject(PaginationService);

  /**
   * Base URL for content API endpoints.
   * @public
   * @type {string}
   */
  // public readonly baseUrlAPI = CONTENT_API_URI;
  public readonly baseUrlAPI = CONTENT_STATIC_IMAGES_URI;
  /**
   * Signal containing the current article slug from route parameters.
   * @protected
   * @type {Signal<string | null>}
   */
  protected slug = signal<string | null>(null);

  /**
   * Signal containing the selected article ID.
   * @private
   * @type {Signal<number>}
   */
  private articleId = signal(this.selectorService.selectedItemId());

  /**
   * Internal signal for tracking the current page number.
   * @private
   * @readonly
   * @type {Signal<number>}
   */
  private readonly _currentPage = signal<number>(1);

  /**
   * Read-only signal exposing the current page number.
   * @public
   * @readonly
   * @type {ReadonlySignal<number>}
   */
  public readonly currentPage = this._currentPage.asReadonly();

  /**
   * Computed signal containing the article metadata.
   * @protected
   * @type {Signal<any>}
   */
  protected articleData = computed(() => this.articleService.articleById());

  /**
   * Computed signal containing the article content organized by pages.
   * @protected
   * @type {Signal<any[]>}
   */
  protected contentsByPages = computed(() => this.contentService.contentsByPages());

  /**
   * Computed signal indicating whether article or content is loading.
   * @protected
   * @type {Signal<boolean>}
   */
  protected isLoading = computed(() =>
    this.articleService.loading() || this.contentService.loading()
  );

  /**
   * Computed signal containing any errors from article or content loading.
   * @protected
   * @type {Signal<any>}
   */
  protected error = computed(() =>
    this.articleService.error() || this.contentService.error()
  );

  /**
   * Computed signal that returns the total number of content pages.
   *
   * @public
   * @returns {number} The total number of pages, or 0 if no pages exist
   */
  public totalPages = computed(() => {
    const pages = this.contentsByPages();
    return pages ? pages.length : 0;
  });

  /**
   * Computed signal that returns the content for the current page.
   *
   * @public
   * @returns {any | null} The current page content object, or null if not found
   */
  public currentPageContent = computed(() => {
    const pages = this.contentsByPages();
    const page = this.currentPage();

    if (!pages || pages.length === 0) return null;

    return pages.find((p: any) => p.page === page) || null;
  });

  /**
   * Constructor that sets up reactive effects for pagination management.
   * Synchronizes pagination service with component state.
   */
  constructor() {
    // Effect to update pagination service when total pages changes
    effect(() => {
      const total = this.totalPages();
      if (total > 0) {
        this.paginationService.initialize(total, 1, this.currentPage());
      }
    }, { injector: this.injector });

    // Effect to sync current page with pagination service
    effect(() => {
      const pageFromService = this.paginationService.currentPage();
      this._currentPage.set(pageFromService);
    }, { injector: this.injector });
  }

  /**
   * Lifecycle hook that is called after component initialization.
   * Subscribes to route parameter changes and loads article data and content by slug.
   *
   * @returns {Promise<void>}
   */
  async ngOnInit(): Promise<void> {
    this.paginationService.reset();

    this.route.params.subscribe(async params => {
      this.slug.set(params['slug']);

      const idArticle = this.articleId();
      const slugArticle = this.slug();

      if (slugArticle) {
        await Promise.all([
          this.articleService.loadArticleBySlug(slugArticle),
          this.contentService.loadContentByArticleSlug(slugArticle)
        ]);
      }
    });
  }

  /**
   * Lifecycle hook that is called when the component is destroyed.
   * Cleans up the content store and resets pagination state.
   *
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.contentService.clearStore();
    this.paginationService.reset();
  }
}