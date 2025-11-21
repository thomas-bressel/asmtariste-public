import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection} from '@angular/core';
import { provideRouter, withViewTransitions, withInMemoryScrolling } from '@angular/router';
import localeFr from '@angular/common/locales/fr';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';


registerLocaleData(localeFr, 'fr-FR');

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'fr-FR'
    },
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes,  withViewTransitions(), withInMemoryScrolling({
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
    })),
    provideHttpClient()
  ]
};
