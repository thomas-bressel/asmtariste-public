import { Component, inject, OnInit } from '@angular/core';
import { SeoService } from '@services/seo.service';

@Component({
  selector: 'main[app-mentions-legales]',
  imports: [],
  templateUrl: './mentions-legales.html',
  styleUrl: '../legal.scss',
})
export class MentionsLegales implements OnInit{

   private seo = inject(SeoService);

   ngOnInit(): void {
    this.seo.updateSeo({
      title: 'Mentions légales - Informations et obligations légales du site ASMtariSTe.fr',
      description: `Consultez les mentions légales du site ASMtariSTe.fr : éditeur, hébergeur, propriété intellectuelle,
        responsabilité, cookies et conformité au RGPD. Informations transparentes sur la gestion du site.`,
      keywords: 'mentions légales, hébergeur, éditeur, propriété intellectuelle, responsabilité, cookies, RGPD, ASMtariSTe, Atari ST',
      image: 'https://asmtariste.fr/assets/home-og.jpg'
    });

    // Données structurées (Schema.org)
    this.seo.addStructuredData({
      '@context': 'https://schema.org',
      '@type': 'Legislation',
      'name': 'Mentions légales - ASMtariste',
      'url': 'https://asmtariste.fr/mentions-legales',
      'description': 'Page des mentions légales du site ASMtariste.fr : informations sur l’éditeur, l’hébergeur, les droits de propriété intellectuelle et la protection des données personnelles.'
    });
  }
}
