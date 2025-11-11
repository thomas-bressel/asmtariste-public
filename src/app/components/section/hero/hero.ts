import { Component } from '@angular/core';

@Component({
  selector: 'section[app-hero]',
  imports: [],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
  host: {
    'class': 'section hero'
  }
})
export class Hero {

}
