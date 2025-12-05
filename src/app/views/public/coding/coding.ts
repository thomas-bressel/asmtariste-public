import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';


import { Card } from "@components/ui/card/card";
import { ArticleService } from '@services/article.service';
import { SeoService } from '@services/seo.service';
import { ItemSelector } from '@services/selector.service';

/**
 * Coding page component for the public area.
 * Route: /coding
 *
 * @component
 * @description Displays coding articles about 68000 assembly programming for Atari ST.
 * Includes courses and code examples covering instructions, registers and advanced
 * programming techniques. Loads articles from the 'coding' category via ArticleService.
 */
@Component({
  selector: 'main[app-coding]',
  imports: [Card],
  templateUrl: './coding.html',
  styleUrl: '../articles.scss',
})
export class Coding implements OnInit {

  /**
   * Article service for fetching and managing coding articles.
   * @private
   * @readonly
   * @type {ArticleService}
   */
  private readonly articleService = inject(ArticleService);

  /**
   * SEO service for managing page metadata and structured data.
   * @private
   * @readonly
   * @type {SeoService}
   */
  private readonly seo = inject(SeoService);

  /**
   * Item selector service for managing selected article state.
   * @private
   * @readonly
   * @type {ItemSelector}
   */
  private readonly selectorService = inject(ItemSelector);

  /**
   * Angular router for navigation.
   * @private
   * @readonly
   * @type {Router}
   */
  private readonly router = inject(Router);

  /**
   * Signal containing the list of coding articles.
   * @public
   * @readonly
   */
  public readonly articles = this.articleService.articles;

  /**
   * Signal indicating whether articles are currently loading.
   * @public
   * @readonly
   */
  public readonly isLoading = this.articleService.loading;


  /**
   * Lifecycle hook that is called after component initialization.
   * Loads coding articles from the 'coding' category and configures SEO metadata.
   *
   * @returns {Promise<void>}
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
   * Handles card click events to navigate to the selected coding article.
   * Stores the selected article ID and slug in the selector service before navigation.
   *
   * @param {number} idArticle - The ID of the selected article
   * @param {string} slug - The URL slug of the selected article
   * @param {Event} event - The click event
   * @returns {void}
   */
  public handleCardBtn(idArticle: number, slug: string, event: Event): void {
    this.selectorService.selectItem(idArticle, slug);
    this.router.navigate(['/coding/article', slug]);

  }
}
