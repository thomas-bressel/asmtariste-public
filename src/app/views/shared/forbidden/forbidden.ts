import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

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
  public errorCode = '403';
  public errorMessage = 'ACCESS DENIED';
  public description = 'Tu n\'as pas les autorisations nécessaires pour accéder à cette ressource.';
}