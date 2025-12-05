import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Header } from '@components/layout/header/header';
import { Footer } from '@components/layout/footer/footer';
import { FoldersMini } from '@components/section/folders-mini/folders-mini';
import { ScrollToTop } from '@components/ui/scroll-to-top/scroll-to-top';

/**
 * Public layout page component that serves as the main layout wrapper for all public pages.
 * This component provides the structural layout including header, footer, and content area.
 *
 * @component
 * @description Main layout container for public pages with navigation and footer
 */
@Component({
  selector: 'div[app-layout]',
  imports: [RouterOutlet, Header, Footer, FoldersMini, ScrollToTop],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout implements OnInit {
  /**
   * Creates an instance of the Layout component.
   *
   * @param {Router} router - Angular router service for navigation management
   */
  constructor(private router: Router) { }

  /**
   * Lifecycle hook that is called after component initialization.
   * Currently used for potential initial navigation (commented out).
   *
   * @returns {void}
   */
  ngOnInit(): void {
    // this.router.navigate(['accueil']);
  }
}