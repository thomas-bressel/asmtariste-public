import { Component, inject , OnInit } from '@angular/core';
import { SeoService } from '@services/seo.service';
@Component({
  selector: 'main[app-cgu]',
  imports: [],
  templateUrl: './cgu.html',
  styleUrl: '../legal.scss',
})
export class Cgu implements OnInit {

    private seo = inject(SeoService);
ngOnInit(): void {
    this.seo.updateSeo({
      title: 'Conditions Générales d’Utilisation - CGU du site ASMtariSTe.fr',
      description: `Prenez connaissance des Conditions Générales d’Utilisation du site ASMtariSTe.fr : règles d’accès,
        système de dons, droits des utilisateurs, propriété intellectuelle, responsabilité et RGPD. En vigueur au 09 novembre 2025.`,
      keywords: 'CGU, conditions générales, utilisation, ASMtariSTe, dons, contenu premium, Atari ST, 68000, propriété intellectuelle, utilisateur, législation',
      image: 'https://asmtariste.fr/assets/home-og.jpg'
    });

    // Données structurées (Schema.org)
    this.seo.addStructuredData({
      '@context': 'https://schema.org',
      '@type': 'TermsOfService',
      'name': 'Conditions Générales d’Utilisation - ASMtariste',
      'url': 'https://asmtariste.fr/conditions-generales',
      'description': 'Conditions Générales d’Utilisation du site ASMtariste.fr : règles d’accès, contributions, droits, propriété intellectuelle et responsabilités.',
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
