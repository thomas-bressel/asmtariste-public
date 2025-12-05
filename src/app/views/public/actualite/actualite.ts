import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';


import { Card } from "@components/ui/card/card";
import { ArticleService } from '@services/article.service';
import { SeoService } from '@services/seo.service';
import { ItemSelector } from '@services/selector.service';

/**
 * News page component for the public area.
 * Route: /actualite
 *
 * @component
 * @description Displays news articles about the French Atari ST scene including demos, games,
 * events, interviews and community updates. Loads articles from the 'actualité' category
 * via ArticleService.
 */
@Component({
  selector: 'app-actualite',
  imports: [Card],
  templateUrl: './actualite.html',
  styleUrl: '../articles.scss',
})
export class Actualite implements OnInit{

  /**
   * Article service for fetching and managing news articles.
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
   * Signal containing the list of news articles.
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
   * Loads news articles from the 'actualité' category and configures SEO metadata.
   *
   * @returns {Promise<void>}
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
   * Handles card click events to navigate to the selected article.
   * Stores the selected article ID and slug in the selector service before navigation.
   *
   * @param {number} idArticle - The ID of the selected article
   * @param {string} slug - The URL slug of the selected article
   * @param {Event} event - The click event
   * @returns {void}
   */
  public handleCardBtn(idArticle: number, slug: string, event: Event): void {
    this.selectorService.selectItem(idArticle, slug);
    this.router.navigate(['/actualite/article', slug]);

  }




}