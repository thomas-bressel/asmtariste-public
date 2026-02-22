import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection, provideAppInitializer, inject } from '@angular/core';
import { provideRouter, withViewTransitions, withInMemoryScrolling } from '@angular/router';
import localeFr from '@angular/common/locales/fr';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import { AuthService } from '@services/auth.service';
import { MaintenanceService } from '@services/maintenance.service';
import { AnalyticsService } from '@services/analytics.service';


registerLocaleData(localeFr, 'fr-FR');

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'fr-FR'
    },
    // Initialisation du service de maintenance (AVANT AuthService)
    // Vérifie si le site est en maintenance au démarrage de l'app
    provideAppInitializer(() => {
      const maintenanceService = inject(MaintenanceService);
      return maintenanceService.checkStatus();
    }),
    // Initialisation du service d'authentification
    provideAppInitializer(() => {
      const authService = inject(AuthService);
      return authService.initialize();
    }),
    // Initialisation de Google Analytics
    provideAppInitializer(() => {
      const analyticsService = inject(AnalyticsService);
      analyticsService.initialize();
    }),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes,  withViewTransitions(), withInMemoryScrolling({
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
    })),
    provideHttpClient()
  ]
};
