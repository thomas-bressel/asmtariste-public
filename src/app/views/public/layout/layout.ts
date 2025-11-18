import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Header } from '@components/layout/header/header';
import { Footer } from '@components/layout/footer/footer';
import { FoldersMini } from '@components/section/folders-mini/folders-mini';
import { ScrollToTop } from '@components/ui/scroll-to-top/scroll-to-top';

@Component({
  selector: 'div[app-layout]',
  imports: [RouterOutlet, Header, Footer, FoldersMini, ScrollToTop],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout implements OnInit {
  constructor(private router: Router) { }

  ngOnInit(): void {
    // this.router.navigate(['accueil']);
  }
}