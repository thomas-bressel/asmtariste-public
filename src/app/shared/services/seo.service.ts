import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { SeoData } from '../models/seo.model';

/**
 * SEO SERVICE - Search Engine Optimization Management
 *
 * Manages all SEO-related meta tags and structured data for the application.
 * Handles title, description, Open Graph, Twitter Cards, and canonical URLs.
 */
@Injectable({
  providedIn: 'root',
})
export class SeoService {
   private meta = inject(Meta);
  private title = inject(Title);
  private router = inject(Router);

  /** Default SEO configuration applied when no specific data is provided */
  private defaultSeo: SeoData = {
    title: `ASMtariste - Maîtrise l'assembleur du 68000 sur Atari ST`,
    description: `Apprends à programmer en assembleur sur le légendaire Motorola 68000 de l'Atari ST. Cours complets, exemples pratiques et ressources téléchargeables.`,
    image: 'https://asmtariste.fr/assets/og-image.jpg',
    type: 'website'
  };

  constructor() {
    this.setupRouteListener();
  }

  /**
   * Sets up a listener for route changes to automatically update the canonical URL
   * Called during service initialization
   */
  private setupRouteListener(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updateCanonicalUrl(event.urlAfterRedirects);
      });
  }

  /**
   * Updates all SEO meta tags for the current page
   * Merges provided data with default SEO configuration
   * Updates title, meta tags, Open Graph, Twitter Cards, and canonical URL
   * @param data - Partial SEO data to update the tags with
   */
  updateSeo(data: Partial<SeoData>): void {
    const seo = { ...this.defaultSeo, ...data };
    const url = seo.url || `https://asmtariste.fr${this.router.url}`;

    // Title
    this.title.setTitle(seo.title);

    // Standard Meta Tags
    this.meta.updateTag({ name: 'description', content: seo.description });
    if (seo.keywords)  this.meta.updateTag({ name: 'keywords', content: seo.keywords });
    if (seo.author)  this.meta.updateTag({ name: 'author', content: seo.author });

    // Open Graph (Facebook, LinkedIn)
    this.meta.updateTag({ property: 'og:title', content: seo.title });
    this.meta.updateTag({ property: 'og:description', content: seo.description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:type', content: seo.type || 'website' });
    if (seo.image) {
      this.meta.updateTag({ property: 'og:image', content: seo.image });
      this.meta.updateTag({ property: 'og:image:width', content: '1200' });
      this.meta.updateTag({ property: 'og:image:height', content: '630' });
    }

    // Twitter Card
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: seo.title });
    this.meta.updateTag({ name: 'twitter:description', content: seo.description });
    if (seo.image) {
      this.meta.updateTag({ name: 'twitter:image', content: seo.image });
    }

    // Canonical URL
    this.updateCanonicalUrl(url);
  }



  /**
   * Updates the canonical URL in the document head
   * Creates the link element if it doesn't exist
   * Ensures the URL is absolute with proper domain
   * @param url - The canonical URL to set (can be relative or absolute)
   */
  private updateCanonicalUrl(url: string): void {
    const fullUrl = url.startsWith('http') ? url : `https://asmtariste.fr${url}`;

    let link: HTMLLinkElement | null = document.querySelector('link[rel="canonical"]');

    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }

    link.setAttribute('href', fullUrl);
  }

  /**
   * Adds or updates structured JSON-LD data in the document head
   * Used for rich snippets and enhanced search results
   * Creates the script element if it doesn't exist
   * @param data - Structured data object to add as JSON-LD (schema.org format)
   */
  addStructuredData(data: any): void {
    let script: HTMLScriptElement | null = document.querySelector('script[type="application/ld+json"]');
    
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    
    script.textContent = JSON.stringify(data);
  }
}
