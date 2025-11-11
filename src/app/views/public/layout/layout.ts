import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { Header } from '@components/layout/header/header';
import { Footer } from '@components/layout/footer/footer';
import { Cookie } from '@components/ui/cookie/cookie';

@Component({
  selector: 'div[app-layout]',
  imports: [RouterOutlet, Header, Footer, Cookie],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.router.navigate(['accueil']);
  }


}
