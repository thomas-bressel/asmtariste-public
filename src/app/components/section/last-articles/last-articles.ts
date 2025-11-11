import { Component } from '@angular/core';
import { Card } from "@components/ui/card/card";

@Component({
  selector: 'section[app-last-articles]',
  imports: [Card],
  templateUrl: './last-articles.html',
  styleUrl: './last-articles.scss',
  host: {
    'class': 'section'
  }
})
export class LastArticles {



}
