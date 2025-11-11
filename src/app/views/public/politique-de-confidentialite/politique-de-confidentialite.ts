import { Component, inject, OnInit } from '@angular/core';
import { SeoService } from '@services/seo.service';

@Component({
  selector: 'main[app-politique-de-confidentialite]',
  imports: [],
  templateUrl: './politique-de-confidentialite.html',
  styleUrl: '../legal.scss',
})
export class PolitiqueDeConfidentialite implements OnInit  {

   private seo = inject(SeoService);



ngOnInit(): void {
    this.seo.updateSeo({
      title: 'Politique de confidentialité - Protection des données personnelles',
      description: `Découvrez comment ASMtariSTe.fr protège vos données personnelles conformément au RGPD.
        Informations sur la collecte, le traitement, la conservation et vos droits d’accès, de rectification et de suppression.`,
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
