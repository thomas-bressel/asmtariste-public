import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { UserList } from '@components/ui/user-list/user-list';

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
