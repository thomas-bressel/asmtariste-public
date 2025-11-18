import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

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
  public errorCode = '404';
  public errorMessage = 'PAGE NOT FOUND';
  public description = 'La page que tu cherches n\'existe pas ou a été déplacée.';
}