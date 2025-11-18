import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';


import { Card } from "@components/ui/card/card";
import { ArticleService } from '@services/article.service';
import { SeoService } from '@services/seo.service';
import { ItemSelector } from '@services/selector.service';


@Component({
  selector: 'app-actualite',
  imports: [Card],
  templateUrl: './actualite.html',
  styleUrl: '../articles.scss',
})
export class Actualite implements OnInit{

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
  public async ngOnInit(): Promise<void> {
    await this.articleService.loadArticlesByCategory('actualité');

    this.seo.updateSeo({
      title: 'Actualité - Dernières nouvelles de la scène Atari ST française',
      description: `Suivez l'actualité de la scène Atari ST française : sorties de démos, jeux, événements, interviews et nouveautés de la communauté rétro.`,
      keywords: 'actualité, Atari ST, scène française, démos, jeux rétro, événements, communauté, nouveautés',
      image: 'https://asmtariste.fr/assets/home-og.jpg'
    });

    this.seo.addStructuredData({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      'name': 'Actualité - ASMtariste',
      'url': 'https://asmtariste.fr/actualite',
      'description': 'Actualité de la scène Atari ST française : sorties, événements et nouveautés'
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
    this.router.navigate(['/actualite/article', slug]);

  }




}