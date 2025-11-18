import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';


import { Card } from "@components/ui/card/card";
import { ArticleService } from '@services/article.service';
import { SeoService } from '@services/seo.service';
import { ItemSelector } from '@services/selector.service';


@Component({
  selector: 'main[app-tutorials]',
  imports: [Card],
  templateUrl: './tutorials.html',
  styleUrl: '../articles.scss',
})
export class Tutorials implements OnInit {

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
    await this.articleService.loadArticlesByCategory('tutoriel');

    this.seo.updateSeo({
      title: 'tutoriel - Guides pratiques Atari ST',
      description: `tutoriel détaillés pour apprendre à programmer sur Atari ST. Exemples concrets, explications pas à pas et projets complets en assembleur 68000.`,
      keywords: 'tutoriel, guides, Atari ST, 68000, assembleur, exemples, projets, apprentissage',
      image: 'https://asmtariste.fr/assets/home-og.jpg'
    });

    this.seo.addStructuredData({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      'name': 'tutoriel - ASMtariste',
      'url': 'https://asmtariste.fr/tutorials',
      'description': 'tutoriel pratiques pour la programmation Atari ST en assembleur 68000'
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
    this.router.navigate(['/tutoriel/article', slug]);

  }

}
