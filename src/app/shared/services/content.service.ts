import { Injectable, inject } from '@angular/core';
import { ContentApiService } from '@services/api/content-api.service';
import { ContentStore } from '@services/store/content-store.service';
import { ContentData } from '@models/content.model';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private readonly api = inject(ContentApiService);
  private readonly store = inject(ContentStore);

  readonly contentsByPages = this.store.contentsByPages;
  readonly loading = this.store.loading;
  readonly error = this.store.error;

  // async loadContentByIdArticle(articleId: number): Promise<void> {
  //   try {
  //     this.store.setLoading(true);
  //     this.store.setError(null);

  //     const contents = await this.api.getContentByIdArticle(articleId);
  //     this.store.setContents(contents);
  //   } catch (error) {
  //     const message = `Erreur lors du chargement du contenu`;
  //     console.error(message, error);
  //     this.store.setError(message);
  //   } finally {
  //     this.store.setLoading(false);
  //   }
  // }



  async loadContentByArticleSlug(articleSlug: string): Promise<void> {
    try {
      this.store.setLoading(true);
      this.store.setError(null);

      const contents = await this.api.getContentByArticleSlug(articleSlug);
      // console.log('Content : ', contents)
      this.store.setContents(contents);
    } catch (error) {
      const message = `Erreur lors du chargement du contenu`;
      console.error(message, error);
      this.store.setError(message);
    } finally {
      this.store.setLoading(false);
    }
  }

  clearStore(): void {
    this.store.clearStore();
  }
}
