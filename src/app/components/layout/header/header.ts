import { Component, signal } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'header[app-header]',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  host: {
    'class': 'header'
  }
})
export class Header {

public isOpen = signal<boolean>(false);


  public toggleMenu(): void {
    this.isOpen.set(!this.isOpen());


  }


  public openLoginModal(): void {
    // Logic to open login modal
    
  }
}