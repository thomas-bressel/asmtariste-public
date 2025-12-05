import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { UserList } from '@components/ui/user-list/user-list';

/**
 * Footer component that displays the website footer section.
 *
 * This is an Angular standalone component that renders the footer with navigation links
 * and user list. It uses a semantic <footer> element as the selector.
 *
 * @component
 * @standalone
 * @selector footer[app-footer]
 * @example
 * <footer app-footer></footer>
 */
@Component({
  selector: 'footer[app-footer]',
  imports: [RouterLink, UserList],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  host: {
    class: 'footer text-color-white bg-color-dark'
  }
})
export class Footer {

}
