import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CookieService } from '@services/cookie.service';

/**
 * Cookie consent banner component for GDPR compliance.
 *
 * This is an Angular standalone component that manages cookie consent.
 * It displays a consent banner on first visit, handles user acceptance/refusal,
 * and can block content access until consent is given. Includes a detailed
 * information view about cookies.
 *
 * @component
 * @standalone
 * @implements {OnInit}
 * @selector section[app-cookie]
 * @example
 * <section app-cookie></section>
 */
@Component({
  selector: 'section[app-cookie]',
  imports: [CommonModule, RouterLink],
  templateUrl: './cookie.html',
  styleUrl: './cookie.scss'
})
export class Cookie implements OnInit {
  /**
   * Injected cookie service for managing consent state.
   * @private
   */
  private cookieService = inject(CookieService);

  /**
   * Signal controlling banner visibility.
   * @protected
   */
  protected showBanner = signal<boolean>(false);

  /**
   * Signal controlling detailed information visibility.
   * @protected
   */
  protected showDetails = signal<boolean>(false);

  /**
   * Signal indicating if content access is blocked.
   * @protected
   */
  protected isBlocked = signal<boolean>(false);

  /**
   * Computed signal determining if the consent modal should be displayed.
   * Modal shows when banner is visible AND content is blocked.
   * @readonly
   */
  public shouldShowModal = computed(() =>
    this.showBanner() && this.isBlocked()
  );

  /**
   * Computed signal determining if the blocking wall should be displayed.
   * Wall shows when content is blocked BUT banner is hidden (after refusal).
   * @readonly
   */
  public shouldShowWall = computed(() =>
    this.isBlocked() && !this.showBanner()
  );

  /**
   * Initializes the component and sets up cookie consent state.
   *
   * Lifecycle hook that runs once after component initialization.
   *
   * @returns {void}
   */
  ngOnInit(): void {
    this.initCookieConsent();
  }

  /**
   * Initializes cookie consent state based on stored preferences.
   *
   * Determines whether to show the banner, block content, or allow access
   * based on previous consent decisions. Increments visit counter for
   * users who have accepted cookies.
   *
   * @private
   * @returns {void}
   */
  private initCookieConsent(): void {
    const consent = this.cookieService.getConsent();

    if (!consent) {
      // First visit: display modal AND block access
      this.showBanner.set(true);
      this.isBlocked.set(true);
    } else if (!consent.accepted) {
      // Cookies refused: display blocking wall
      this.isBlocked.set(true);
      this.showBanner.set(false);
    } else {
      // Cookies accepted: allow everything
      this.isBlocked.set(false);
      this.showBanner.set(false);
      this.cookieService.incrementVisit();
    }
  }

  /**
   * Handles user accepting cookies.
   *
   * Saves consent, hides banner, unblocks content, and reloads the page
   * to apply changes.
   *
   * @protected
   * @returns {void}
   */
  protected handleAccept(): void {
    this.cookieService.setConsent(true);
    this.showBanner.set(false);
    this.isBlocked.set(false);
    window.location.reload();
  }

  /**
   * Handles user refusing cookies.
   *
   * Saves refusal, hides banner, and blocks content access.
   *
   * @protected
   * @returns {void}
   */
  protected handleRefuse(): void {
    this.cookieService.setConsent(false);
    this.showBanner.set(false);
    this.isBlocked.set(true);
  }

  /**
   * Toggles the detailed cookie information view.
   *
   * @protected
   * @returns {void}
   */
  protected toggleDetails(): void {
    this.showDetails.update(value => !value);
  }

  /**
   * Reopens the cookie consent banner.
   *
   * Allows users to change their consent decision by showing
   * the banner again and blocking content.
   *
   * @protected
   * @returns {void}
   */
  protected reopenBanner(): void {
    this.showBanner.set(true);
    this.isBlocked.set(true);
  }
}