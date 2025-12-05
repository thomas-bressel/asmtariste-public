import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';


import { Card } from "@components/ui/card/card";
import { ArticleService } from '@services/article.service';
import { SeoService } from '@services/seo.service';
import { ItemSelector } from '@services/selector.service';

/**
 * Documentation page component for the public area.
 * Route: /documentation
 *
 * @component
 * @description Displays technical documentation articles for Atari ST 68000 assembly programming.
 * Includes hardware references, registers, instructions and specifications.
 * Loads articles from the 'documentation' category via ArticleService.
 */
@Component({
  selector: 'main[app-documentations]',
  imports: [Card],
  templateUrl: './documentations.html',
  styleUrl: '../articles.scss',
})
export class Documentation implements OnInit {

  /**
   * Article service for fetching and managing documentation articles.
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
   * Signal containing the list of documentation articles.
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
   * Loads documentation articles from the 'documentation' category and configures SEO metadata.
   *
   * @returns {Promise<void>}
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
   * Handles card click events to navigate to the selected documentation article.
   * Stores the selected article ID and slug in the selector service before navigation.
   *
   * @param {number} idArticle - The ID of the selected article
   * @param {string} slug - The URL slug of the selected article
   * @param {Event} event - The click event
   * @returns {void}
   */
  public handleCardBtn(idArticle: number, slug: string, event: Event): void {
    this.selectorService.selectItem(idArticle, slug);
    this.router.navigate(['/documentation/article', slug]);

  }



}