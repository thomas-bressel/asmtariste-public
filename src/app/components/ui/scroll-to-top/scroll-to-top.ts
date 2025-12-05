import { Component, signal, OnInit, OnDestroy } from '@angular/core';

/**
 * Scroll to top button component for smooth page navigation.
 *
 * This is an Angular standalone component that displays a floating button
 * to scroll back to the top of the page. The button becomes visible when
 * the user scrolls down more than 300 pixels and provides smooth scrolling
 * behavior when clicked.
 *
 * @component
 * @standalone
 * @implements {OnInit}
 * @implements {OnDestroy}
 * @selector button[app-scroll-to-top]
 * @example
 * <button app-scroll-to-top></button>
 */
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
  /**
   * Signal controlling button visibility based on scroll position.
   * Becomes true when user scrolls more than 300 pixels down.
   */
  public isVisible = signal<boolean>(false);

  /**
   * Initializes the component by adding scroll event listener.
   *
   * Lifecycle hook that runs once after the component is initialized.
   * Attaches the scroll handler to monitor page scroll position.
   *
   * @returns {void}
   */
  ngOnInit(): void {
    window.addEventListener('scroll', this.handleScroll);
  }

  /**
   * Cleans up by removing scroll event listener.
   *
   * Lifecycle hook that runs once before the component is destroyed.
   * Removes the scroll handler to prevent memory leaks.
   *
   * @returns {void}
   */
  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.handleScroll);
  }

  /**
   * Handles scroll events to update button visibility.
   *
   * Shows the button when scroll position exceeds 300 pixels,
   * hides it otherwise.
   *
   * @private
   * @returns {void}
   */
  private handleScroll = (): void => {
    const scrollY = window.scrollY;
    this.isVisible.set(scrollY > 300);
  }

  /**
   * Scrolls the page to the top with smooth animation.
   *
   * Triggered when the button is clicked. Uses smooth scrolling
   * behavior for better user experience.
   *
   * @public
   * @returns {void}
   */
  public scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}