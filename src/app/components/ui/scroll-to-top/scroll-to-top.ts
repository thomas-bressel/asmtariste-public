import { Component, signal, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'button[app-scroll-to-top]',
  imports: [],
  templateUrl: './scroll-to-top.html',
  styleUrl: './scroll-to-top.scss',
  host: {
    'class': 'scroll-to-top',
    '[class.visible]': 'isVisible()',
    '(click)': 'scrollToTop()',
    'type': 'button',
    'aria-label': 'Remonter en haut de la page'
  }
})
export class ScrollToTop implements OnInit, OnDestroy {
  public isVisible = signal<boolean>(false);

  ngOnInit(): void {
    window.addEventListener('scroll', this.handleScroll);
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.handleScroll);
  }

  private handleScroll = (): void => {
    const scrollY = window.scrollY;
    this.isVisible.set(scrollY > 300);
  }

  public scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}