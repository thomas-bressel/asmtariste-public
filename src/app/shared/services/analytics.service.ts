import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private initialized = false;

  constructor(private router: Router) {}

  /**
   * Initialise le tracking automatique des pages
   * Cette méthode doit être appelée au démarrage de l'application
   */
  initialize(): void {
    if (this.initialized) {
      return;
    }

    // Vérifie que gtag est disponible (chargé depuis index.html)
    if (!window.gtag) {
      console.warn('Google Analytics (gtag) n\'est pas chargé');
      return;
    }

    // Track automatiquement chaque changement de page
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.trackPageView(event.urlAfterRedirects);
      });

    this.initialized = true;
    console.log('Google Analytics initialisé avec succès');
  }

  /**
   * Envoie un événement de page vue à Google Analytics
   * @param url URL de la page visitée
   */
  private trackPageView(url: string): void {
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: url
      });
    }
  }

  /**
   * Envoie un événement personnalisé à Google Analytics
   * @param eventName Nom de l'événement
   * @param eventParams Paramètres de l'événement (optionnel)
   *
   * Exemple : trackEvent('download', { file_name: 'tutorial.pdf' })
   */
  trackEvent(eventName: string, eventParams?: any): void {
    if (window.gtag) {
      window.gtag('event', eventName, eventParams);
    }
  }
}
