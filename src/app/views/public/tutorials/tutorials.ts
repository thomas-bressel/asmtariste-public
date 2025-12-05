import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';


import { Card } from "@components/ui/card/card";
import { ArticleService } from '@services/article.service';
import { SeoService } from '@services/seo.service';
import { ItemSelector } from '@services/selector.service';

/**
 * Tutorials page component for the public area.
 * Route: /tutorials
 *
 * @component
 * @description Displays tutorial articles for learning Atari ST programming.
 * Includes detailed guides with concrete examples, step-by-step explanations and
 * complete projects in 68000 assembly. Loads articles from the 'tutoriel' category
 * via ArticleService.
 */
@Component({
  selector: 'main[app-tutorials]',
  imports: [Card],
  templateUrl: './tutorials.html',
  styleUrl: '../articles.scss',
})
export class Tutorials implements OnInit {

  /**
   * Article service for fetching and managing tutorial articles.
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
   * Signal containing the list of tutorial articles.
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
   * Loads tutorial articles from the 'tutoriel' category and configures SEO metadata.
   *
   * @returns {Promise<void>}
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
   * Handles card click events to navigate to the selected tutorial article.
   * Stores the selected article ID and slug in the selector service before navigation.
   *
   * @param {number} idArticle - The ID of the selected article
   * @param {string} slug - The URL slug of the selected article
   * @param {Event} event - The click event
   * @returns {void}
   */
  public handleCardBtn(idArticle: number, slug: string, event: Event): void {
    this.selectorService.selectItem(idArticle, slug);
    this.router.navigate(['/tutoriel/article', slug]);

  }

}
