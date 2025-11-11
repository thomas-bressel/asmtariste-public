import { Component } from '@angular/core';
import { Hero } from "@components/section/hero/hero";
import { Footer } from "@components/layout/footer/footer";
import { LastArticles } from "@components/section/last-articles/last-articles";
import { Folders } from "@components/section/folders/folders";


@Component({
  selector: 'div[app-accueil]',
  imports: [Hero, Footer, LastArticles,Folders],
  templateUrl: './accueil.html',
  styleUrl: './accueil.scss',
})
export class Accueil  {



}
