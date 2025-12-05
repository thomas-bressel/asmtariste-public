import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Cookie } from '@components/ui/cookie/cookie';
import { NotificationComponent } from '@components/ui/notification/notification';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Cookie, NotificationComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'public';
}
