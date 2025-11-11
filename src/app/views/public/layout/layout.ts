import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '@components/layout/header/header';
import { Accueil } from "../accueil/accueil";
import { Footer } from '@components/layout/footer/footer';
import { Router } from '@angular/router';

@Component({
  selector: 'div[app-layout]',
  imports: [RouterOutlet, Header, Accueil, Footer],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.router.navigate(['accueil']);
  }


}
