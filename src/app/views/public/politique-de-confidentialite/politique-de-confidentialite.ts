import { Component, inject, OnInit } from '@angular/core';
import { SeoService } from '@services/seo.service';

/**
 * Privacy policy page component for the public area.
 * Route: /politique-de-confidentialite
 *
 * @component
 * @description Displays the privacy policy explaining how ASMtariSTe.fr protects personal data
 * in compliance with GDPR. Includes information about data collection, processing, storage,
 * and user rights regarding access, correction and deletion.
 */
@Component({
  selector: 'main[app-politique-de-confidentialite]',
  imports: [],
  templateUrl: './politique-de-confidentialite.html',
  styleUrl: '../legal.scss',
})
export class PolitiqueDeConfidentialite implements OnInit  {

  /**
   * SEO service for managing page metadata and structured data.
   * @private
   * @type {SeoService}
   */
  private seo = inject(SeoService);



  /**
   * Lifecycle hook that is called after component initialization.
   * Configures SEO metadata and structured data for the privacy policy page.
   *
   * @returns {void}
   */
  ngOnInit(): void {
    this.seo.updateSeo({
      title: 'Politique de confidentialité - Protection des données personnelles',
      description: `Découvrez comment ASMtariSTe.fr protège vos données personnelles conformément au RGPD.
        Informations sur la collecte, le traitement, la conservation et vos droits d'accès, de rectification et de suppression.`,
      keywords: 'confidentialité, RGPD, protection des données, vie privée, CNIL, cookies, sécurité, ASMtariste',
      image: 'https://asmtariste.fr/assets/home-og.jpg'
    });

    this.seo.addStructuredData({
      '@context': 'https://schema.org',
      '@type': 'PrivacyPolicy',
      'name': 'Politique de confidentialité - ASMtariste',
      'url': 'https://asmtariste.fr/politique-de-confidentialite',
      'description': 'Politique de confidentialité du site ASMtariste.fr conforme au RGPD : collecte, traitement et sécurité des données personnelles.'
    });
  }
}
