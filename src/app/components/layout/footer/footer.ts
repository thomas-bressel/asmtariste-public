import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'footer[app-footer]',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  host: {
    class: 'footer text-color-white bg-color-dark'
  }
})
export class Footer {

}
