// Angular imports
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Components imports
import { Card } from "@components/ui/card/card";

// Service imports
import { ArticleService } from '@services/article.service';

// Config imports
import { CONTENT_API_URI } from 'src/app/shared/config-api';
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

  // Configuration API
  public readonly baseUrlAPI = CONTENT_API_URI;

  // Dependencies injection
  private readonly route = inject(Router);
  private readonly articleService = inject(ArticleService);

  // Facade signals properties exposed to template 
  public readonly articles = this.articleService.articles;
  public readonly isLoading = this.articleService.loading;
  public readonly selectedArticle = this.articleService.selectedArticle;
  public readonly articlesCount = this.articleService.articlesCount;

  async ngOnInit(): Promise<void> {
    await this.articleService.loadArticles();

    // debug
    console.log('[COMPONENT] Articles loaded:', this.articles());

  }




  public handleNavigate(category: string, slug: string, event: Event) {
    let category_slug = category;
    console.log('category', category)

    if (category === "actualité")  category_slug = "actualite"
    
   this.route.navigate([`./${category_slug}/article/${slug}`])
  }

}
