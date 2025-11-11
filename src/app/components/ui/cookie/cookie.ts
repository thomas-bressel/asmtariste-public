import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CookieService } from '@services/cookie.service';

@Component({
  selector: 'app-cookie',
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

  // Computed
  protected shouldShowModal = computed(() => 
    this.showBanner() && !this.isBlocked()
  );
  
  protected shouldShowWall = computed(() => 
    this.isBlocked() && !this.showBanner()
  );

  ngOnInit(): void {
    this.initCookieConsent();
  }

  private initCookieConsent(): void {
    const consent = this.cookieService.getConsent();
    
    if (!consent) {
      // Première visite
      this.showBanner.set(true);
      this.isBlocked.set(true);
    } else if (!consent.accepted) {
      // L'utilisateur a refusé
      this.isBlocked.set(true);
      this.showBanner.set(false);
    } else {
      // L'utilisateur a accepté
      this.isBlocked.set(false);
      this.cookieService.incrementVisit();
    }
  }

  protected handleAccept(): void {
    this.cookieService.setConsent(true);
    this.showBanner.set(false);
    this.isBlocked.set(false);
    // Recharge pour débloquer le contenu
    window.location.reload();
  }

  protected handleRefuse(): void {
    this.cookieService.setConsent(false);
    this.showBanner.set(false);
    this.isBlocked.set(true);
  }

  protected toggleDetails(): void {
    this.showDetails.update(value => !value);
  }

  protected reopenBanner(): void {
    this.showBanner.set(true);
  }
}