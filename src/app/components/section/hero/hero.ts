import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'section[app-hero]',
  imports: [RouterLink],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
  host: {
    'class': 'section hero'
  }
})
export class Hero {

}
