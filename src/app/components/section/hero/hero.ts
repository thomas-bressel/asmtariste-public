import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Hero section component that displays the main hero banner.
 *
 * This is an Angular standalone component that renders the hero section of a page,
 * typically containing a large banner with call-to-action elements.
 * Uses a semantic <section> element as the selector.
 *
 * @component
 * @standalone
 * @selector section[app-hero]
 * @example
 * <section app-hero></section>
 */
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
