import { Component, inject, OnInit} from '@angular/core';
import { Hero } from "@components/section/hero/hero";
import { LastArticles } from "@components/section/last-articles/last-articles";
import { Folders } from "@components/section/folders/folders";
import { SeoService } from '@services/seo.service';


@Component({
  selector: 'div[app-accueil]',
  imports: [Hero, LastArticles,Folders],
  templateUrl: './accueil.html',
  styleUrl: './accueil.scss',
})
export class Accueil  implements OnInit  {

 private seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.updateSeo({
      title: 'Accueil - ASMtariSTe.fr, apprendre l’assembleur 68000 sur Atari ST',
      description: `Découvrez ASMtariSTe.fr, la plateforme dédiée à l'apprentissage de l'assembleur Motorola 68000 sur Atari ST.
        Articles, dossiers et ressources pour comprendre le fonctionnement de cette machine mythique.`,
      keywords: 'Atari ST, assembleur 68000, programmation, rétro-informatique, tutoriels, cours, jeux, démos',
      image: 'https://asmtariste.fr/assets/home-og.jpg'
    });

    this.seo.addStructuredData({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': 'ASMtariste',
      'url': 'https://asmtariste.fr',
      'description': 'Apprenez à programmer en assembleur 68000 sur Atari ST grâce à des cours et tutoriels clairs et complets.'
    });
  }


}
