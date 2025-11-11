import { Component, signal } from '@angular/core';

@Component({
  selector: 'article[app-card]',
  imports: [],
  templateUrl: './card.html',
  styleUrl: './card.scss',
  host: {
    'class': 'article fade-in index2',
    '[class.visible]':'isArticleVisible()'
  }
})
export class Card {

public isArticleVisible = signal<boolean>(true);



}
