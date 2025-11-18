import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';


import { Card } from "@components/ui/card/card";
import { ArticleService } from '@services/article.service';
import { SeoService } from '@services/seo.service';
import { ItemSelector } from '@services/selector.service';


@Component({
  selector: 'main[app-documentations]',
  imports: [Card],
  templateUrl: './documentations.html',
  styleUrl: '../articles.scss',
})
export class Documentation implements OnInit {

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
    await this.articleService.loadArticlesByCategory('documentation');

    this.seo.updateSeo({
      title: 'Documentation - Références techniques Atari ST',
      description: `Documentation technique complète pour programmer en assembleur 68000 sur Atari ST. Références matérielles, registres, instructions et spécifications.`,
      keywords: 'documentation, Atari ST, 68000, assembleur, référence technique, registres, instructions',
      image: 'https://asmtariste.fr/assets/home-og.jpg'
    });

    this.seo.addStructuredData({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      'name': 'Documentation - ASMtariste',
      'url': 'https://asmtariste.fr/documentation',
      'description': 'Documentation technique pour la programmation Atari ST en assembleur 68000'
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
    this.router.navigate(['/documentation/article', slug]);

  }



}