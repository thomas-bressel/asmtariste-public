import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * 404 Not Found error page component.
 * Route: /not-found (also used as fallback for invalid routes)
 *
 * @component
 * @description Displays a 404 Not Found error page when users navigate to non-existent
 * or removed pages. Shows error code, message, and description with a link back to the homepage.
 */
@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss',
  host: {
    'class': 'section error-page'
  }
})
export class NotFound {
  /**
   * HTTP error code for page not found.
   * @public
   * @type {string}
   */
  public errorCode = '404';

  /**
   * Error message displayed to the user.
   * @public
   * @type {string}
   */
  public errorMessage = 'PAGE NOT FOUND';

  /**
   * Detailed description explaining the not found error.
   * @public
   * @type {string}
   */
  public description = 'La page que tu cherches n\'existe pas ou a été déplacée.';
}