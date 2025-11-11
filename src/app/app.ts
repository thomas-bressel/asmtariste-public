import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Cookie } from '@components/ui/cookie/cookie';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Cookie],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'public';
}
