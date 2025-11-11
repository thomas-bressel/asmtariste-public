import { Component } from '@angular/core';
import { Hero } from "@components/section/hero/hero";
import { LastArticles } from "@components/section/last-articles/last-articles";
import { Folders } from "@components/section/folders/folders";


@Component({
  selector: 'div[app-accueil]',
  imports: [Hero, LastArticles,Folders],
  templateUrl: './accueil.html',
  styleUrl: './accueil.scss',
})
export class Accueil  {



}
