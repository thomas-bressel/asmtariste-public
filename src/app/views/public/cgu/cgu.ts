import { Component, inject , OnInit } from '@angular/core';
import { SeoService } from '@services/seo.service';

/**
 * Terms of Service (CGU) page component for the public area.
 * Route: /conditions-generales
 *
 * @component
 * @description Displays the Terms of Service for ASMtariSTe.fr including access rules,
 * donation system, user rights, intellectual property, liability and GDPR compliance.
 * Effective as of November 9, 2025.
 */
@Component({
  selector: 'main[app-cgu]',
  imports: [],
  templateUrl: './cgu.html',
  styleUrl: '../legal.scss',
})
export class Cgu implements OnInit {

  /**
   * SEO service for managing page metadata and structured data.
   * @private
   * @type {SeoService}
   */
  private seo = inject(SeoService);

  /**
   * Lifecycle hook that is called after component initialization.
   * Configures SEO metadata and structured data for the Terms of Service page.
   *
   * @returns {void}
   */
  ngOnInit(): void {
    this.seo.updateSeo({
      title: 'Conditions Générales d\'Utilisation - CGU du site ASMtariSTe.fr',
      description: `Prenez connaissance des Conditions Générales d'Utilisation du site ASMtariSTe.fr : règles d'accès,
        système de dons, droits des utilisateurs, propriété intellectuelle, responsabilité et RGPD. En vigueur au 09 novembre 2025.`,
      keywords: 'CGU, conditions générales, utilisation, ASMtariSTe, dons, contenu premium, Atari ST, 68000, propriété intellectuelle, utilisateur, législation',
      image: 'https://asmtariste.fr/assets/home-og.jpg'
    });

    this.seo.addStructuredData({
      '@context': 'https://schema.org',
      '@type': 'TermsOfService',
      'name': 'Conditions Générales d\'Utilisation - ASMtariste',
      'url': 'https://asmtariste.fr/conditions-generales',
      'description': 'Conditions Générales d\'Utilisation du site ASMtariste.fr : règles d\'accès, contributions, droits, propriété intellectuelle et responsabilités.',
      'inLanguage': 'fr',
      'dateModified': '2025-11-09',
      'publisher': {
        '@type': 'Organization',
        'name': 'ASMtariste',
        'url': 'https://asmtariste.fr',
        'logo': 'https://asmtariste.fr/assets/home-og.jpg'
      }
    });
  }
}
