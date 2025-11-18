import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';


import { Card } from "@components/ui/card/card";
import { ArticleService } from '@services/article.service';
import { SeoService } from '@services/seo.service';
import { ItemSelector } from '@services/selector.service';


@Component({
  selector: 'main[app-coding]',
  imports: [Card],
  templateUrl: './coding.html',
  styleUrl: '../articles.scss',
})
export class Coding implements OnInit {

  // dependencis injection
  private readonly articleService = inject(ArticleService);
  private readonly seo = inject(SeoService);
  private readonly selectorService = inject(ItemSelector);
  private readonly router = inject(Router);

  public readonly articles = this.articleService.articles;
  public readonly isLoading = this.articleService.loading;


  /**
   * Component initalisation
   */
  async ngOnInit(): Promise<void> {
    await this.articleService.loadArticlesByCategory('coding');

    this.seo.updateSeo({
      title: 'Coding - Programmation assembleur 68000',
      description: `Cours et exemples de code en assembleur 68000 pour Atari ST. Apprenez les instructions, les registres et les techniques de programmation avancées.`,
      keywords: 'coding, programmation, assembleur, 68000, Atari ST, code, exemples, cours',
      image: 'https://asmtariste.fr/assets/home-og.jpg'
    });

    this.seo.addStructuredData({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      'name': 'Coding - ASMtariste',
      'url': 'https://asmtariste.fr/coding',
      'description': 'Cours de programmation en assembleur 68000 pour Atari ST'
    });
  }


  


  /**
   * handle the mouse click on card
   * @param idArticle 
   * @param slug 
   * @param event 
   */
  public handleCardBtn(idArticle: number, slug: string, event: Event): void {
    this.selectorService.selectItem(idArticle, slug);
    this.router.navigate(['/coding/article', slug]);

  }
}