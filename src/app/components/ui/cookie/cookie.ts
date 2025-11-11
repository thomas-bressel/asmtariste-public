import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CookieService } from '@services/cookie.service';

@Component({
  selector: 'section[app-cookie]',
  imports: [CommonModule, RouterLink],
  templateUrl: './cookie.html',
  styleUrl: './cookie.scss'
})
export class Cookie implements OnInit {
  private cookieService = inject(CookieService);
  
  // Signals
  protected showBanner = signal<boolean>(false);
  protected showDetails = signal<boolean>(false);
  protected isBlocked = signal<boolean>(false);

  // Display the modal IF banner visible AND content blocked
  public shouldShowModal = computed(() => 
    this.showBanner() && this.isBlocked()
  );
  
  // Display the blocking wall IF blocked BUT banner hidden (after refusal)
  public shouldShowWall = computed(() => 
    this.isBlocked() && !this.showBanner()
  );

  ngOnInit(): void {
    this.initCookieConsent();
  }

  /**
   * Initialize cookie consent state
   */
  private initCookieConsent(): void {
    const consent = this.cookieService.getConsent();
    
    if (!consent) {

      // First visit : display modal AND block access
      this.showBanner.set(true);
      this.isBlocked.set(true);
    } else if (!consent.accepted) {

      // Cookies refudsed : display wall of blocking
      this.isBlocked.set(true);
      this.showBanner.set(false);
    } else {

      // Cookies accepted : allow everything
      this.isBlocked.set(false);
      this.showBanner.set(false);
      this.cookieService.incrementVisit();
    }
  }

  /**
   * Handle user accepting cookies
   */
  protected handleAccept(): void {
    this.cookieService.setConsent(true);
    this.showBanner.set(false);
    this.isBlocked.set(false);
    window.location.reload();
  }

  /**
   * Handle user refusing cookies
   */
  protected handleRefuse(): void {
    this.cookieService.setConsent(false);
    this.showBanner.set(false);
    this.isBlocked.set(true);
  }

  /**
   * Toggle details view
   */
  protected toggleDetails(): void {
    this.showDetails.update(value => !value);
  }

  /**
   * Reopen the cookie banner
   */
  protected reopenBanner(): void {
    this.showBanner.set(true);
    this.isBlocked.set(true);
  }
}