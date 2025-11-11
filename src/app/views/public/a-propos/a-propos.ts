import { Component, OnInit, inject } from '@angular/core';
import { SeoService } from '@services/seo.service';

@Component({
  selector: 'main[app-a-propos]',
  imports: [],
  templateUrl: './a-propos.html',
  styleUrls: ['../legal.scss', './a-propos.scss'],
})
export class APropos implements OnInit  {

  
 private seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.updateSeo({
      title: 'À propos - Préserver et transmettre l’art du 68000',
      description: `ASMtariSTe.fr est né d'une passion pour l’Atari ST et son processeur Motorola 68000.
        Découvrez la genèse du projet, son approche pédagogique et son modèle freemium pour apprendre à programmer cette machine légendaire.`,
      keywords: 'Atari ST, assembleur 68000, histoire, pédagogie, rétro-programmation, freemium, apprentissage',
      image: 'https://asmtariste.fr/assets/home-og.jpg'
    });

    this.seo.addStructuredData({
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      'name': 'À propos - ASMtariste',
      'url': 'https://asmtariste.fr/a-propos',
      'description': 'Présentation du projet ASMtariste : apprendre et préserver le savoir-faire du processeur Motorola 68000 sur Atari ST.'
    });
  }


}
