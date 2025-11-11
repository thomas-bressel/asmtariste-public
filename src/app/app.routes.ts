import { Routes } from '@angular/router';


export const routes: Routes = [

    {
        path: '',
        loadComponent: async () =>
            (await import('./views/public/layout/layout')).Layout,
        children: [
            {
                path: 'accueil',
                loadComponent: async () =>
                    (await import('./views/public/accueil/accueil')).Accueil
            },
            {
                path: 'a-propos',
                loadComponent: async () =>
                    (await import('./views/public/a-propos/a-propos')).APropos
            },
            {
                path: 'cgu',
                loadComponent: async () =>
                    (await import('./views/public/cgu/cgu')).Cgu
            },
            {
                path: 'mentions-legales',
                loadComponent: async () =>
                    (await import('./views/public/mentions-legales/mentions-legales')).MentionsLegales
            },
            {
                path: 'politique-de-confidentialite',
                loadComponent: async () =>
                    (await import('./views/public/politique-de-confidentialite/politique-de-confidentialite')).PolitiqueDeConfidentialite
            },
        ]
    },


  
    // Route 404
    {
        path: '**',
        loadComponent: async () =>
            (await import('./views/shared/not-found/not-found')).NotFound
    }
];
