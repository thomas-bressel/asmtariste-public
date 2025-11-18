import { Component, inject, OnInit, OnDestroy, signal, computed, effect, Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ItemSelector } from '@services/selector.service';
import { ContentService } from '@services/content.service';
import { ArticleService } from '@services/article.service';
import { PaginationService } from '@services/ui/pagination.service';

import { PaginationComponent } from '@components/ui/pagination/pagination';

import { CONTENT_API_URI } from 'src/app/shared/config-api';

@Component({
  selector: 'app-article',
  imports: [CommonModule, PaginationComponent],
  templateUrl: './article.html',
  styleUrl: './article.scss',
})
export class Article implements OnInit, OnDestroy {
  private readonly injector = inject(Injector);
  private route = inject(ActivatedRoute);
  private selectorService = inject(ItemSelector);
  private contentService = inject(ContentService);
  private articleService = inject(ArticleService);
  private paginationService = inject(PaginationService);

  public baseUrlAPI = CONTENT_API_URI;

  protected slug = signal<string | null>(null);
  private articleId = signal(this.selectorService.selectedItemId());

  // Signal for current page
  private readonly _currentPage = signal<number>(1);
  public readonly currentPage = this._currentPage.asReadonly();

  // Computed signals
  protected articleData = computed(() => this.articleService.articleById());
  protected contentsByPages = computed(() => this.contentService.contentsByPages());
  protected isLoading = computed(() => 
    this.articleService.loading() || this.contentService.loading()
  );
  protected error = computed(() => 
    this.articleService.error() || this.contentService.error()
  );

  /**
   * Computed to get total pages count
   */
  public totalPages = computed(() => {
    const pages = this.contentsByPages();
    return pages ? pages.length : 0;
  });

  /**
   * Computed to get current page content
   */
  public currentPageContent = computed(() => {
    const pages = this.contentsByPages();
    const page = this.currentPage();
    
    if (!pages || pages.length === 0) return null;
    
    return pages.find((p: any) => p.page === page) || null;
  });

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

  async ngOnInit(): Promise<void> {
    this.paginationService.reset();

    this.route.params.subscribe(async params => {
      this.slug.set(params['slug']);

      const idArticle = this.articleId();
      const slugArticle = this.slug();
      console.log('[COMPONENT] slug : ', slugArticle)
      if (slugArticle) {
        await Promise.all([
          // this.articleService.loadArticleById(idArticle),
          this.articleService.loadArticleBySlug(slugArticle),
          this.contentService.loadContentByArticleSlug(slugArticle)
        ]);
      }
    });
  }

  ngOnDestroy(): void {
    this.contentService.clearStore();
    this.paginationService.reset();
  }
}