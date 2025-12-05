import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * 403 Forbidden error page component.
 * Route: /forbidden
 *
 * @component
 * @description Displays a 403 Forbidden error page when users attempt to access
 * resources they don't have permission to view. Shows error code, message, and
 * description with a link back to accessible areas.
 */
@Component({
  selector: 'app-forbidden',
  imports: [RouterLink],
  templateUrl: './forbidden.html',
  styleUrl: './forbidden.scss',
  host: {
    'class': 'section error-page'
  }
})
export class Forbidden {
  /**
   * HTTP error code for forbidden access.
   * @public
   * @type {string}
   */
  public errorCode = '403';

  /**
   * Error message displayed to the user.
   * @public
   * @type {string}
   */
  public errorMessage = 'ACCESS DENIED';

  /**
   * Detailed description explaining the forbidden access error.
   * @public
   * @type {string}
   */
  public description = 'Tu n\'as pas les autorisations nécessaires pour accéder à cette ressource.';
}