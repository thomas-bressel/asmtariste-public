import { Injectable, signal, computed } from '@angular/core';
import { ArticleData } from '@models/article.model';

@Injectable({
  providedIn: 'root'
})
export class ArticleStore {
  private readonly _articles = signal<ArticleData[]>([]);
  private readonly _articleById = signal<ArticleData | null>(null);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _selectedArticleId = signal<number | null>(null);

  readonly articles = this._articles.asReadonly();
  readonly articleById = this._articleById.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly selectedArticleId = this._selectedArticleId.asReadonly();

  readonly selectedArticle = computed(() => {
    const id = this._selectedArticleId();
    if (!id) return null;
    return this._articles().find(article => article.id_articles === id) || null;
  });

  readonly articlesCount = computed(() => this._articles().length);

  setArticles(articles: ArticleData[]): void {
    this._articles.set(articles);
    this._error.set(null);
  }

  setArticleById(article: ArticleData): void {
    this._articleById.set(article);
    this._error.set(null);
  }

  setLoading(loading: boolean): void {
    this._loading.set(loading);
  }

  setError(error: string | null): void {
    this._error.set(error);
  }

  selectArticle(articleId: number | null): void {
    this._selectedArticleId.set(articleId);
  }

  clearStore(): void {
    this._articles.set([]);
    this._articleById.set(null);
    this._loading.set(false);
    this._error.set(null);
    this._selectedArticleId.set(null);
  }
}