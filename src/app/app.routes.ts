import { Routes } from '@angular/router';
import { signupTokenGuard } from '@guards/signup-token-guard';
import { authGuard } from '@guards/auth-guard';


export const routes: Routes = [
    {
        path: '',
        loadComponent: async () =>
            (await import('./views/public/layout/layout')).Layout,
        children: [
             {
                path: '',
                redirectTo: 'accueil',
                pathMatch: 'full'
            },
            {
                path: 'accueil',
                loadComponent: async () =>
                    (await import('./views/public/accueil/accueil')).Accueil
            },
            {
                path: 'actualite',
                loadComponent: async () =>
                    (await import('./views/public/actualite/actualite')).Actualite,
            },
            {
                path: 'actualite/article/:slug',
                loadComponent: async () =>
                    (await import('./views/public/article/article')).Article
            },
            {
                path: 'documentation',
                loadComponent: async () =>
                    (await import('./views/public/documentations/documentations')).Documentation,
            },
            {
                path: 'documentation/article/:slug',
                loadComponent: async () =>
                    (await import('./views/public/article/article')).Article
            },
            {
                path: 'coding',
                loadComponent: async () =>
                    (await import('./views/public/coding/coding')).Coding
            },
            {
                path: 'coding/article/:slug',
                loadComponent: async () =>
                    (await import('./views/public/article/article')).Article
            },
            {
                path: 'tutoriel',
                loadComponent: async () =>
                    (await import('./views/public/tutorials/tutorials')).Tutorials
            },
            {
                path: 'tutoriel/article/:slug',
                loadComponent: async () =>
                    (await import('./views/public/article/article')).Article
            },
            {
                path: 'ressources/:slug',
                loadComponent: async () =>
                    (await import('./views/public/ressources/ressources')).Ressources,
                loadChildren: async () =>
                    (await import('./views/public/ressources/ressources.routes')).routes,
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
            {
                path: 'setup-password',
                loadComponent: async () =>
                    (await import('./views/private/setup-password/setup-password')).SetupPassword,
                canActivate: [signupTokenGuard]
            },
            {
                path: 'mot-de-passe-oublie',
                loadComponent: async () =>
                    (await import('./views/public/mot-de-passe-oublie/mot-de-passe-oublie')).MotDePasseOublie
            },
            {
                path: 'reinit-password',
                loadComponent: async () =>
                    (await import('./views/private/reinit-password/reinit-password')).ReinitPassword,
                canActivate: [signupTokenGuard]
            },
            {
                path: 'profile',
                loadComponent: async () =>
                    (await import('./views/private/profile/profile')).Profile,
                canActivate: [authGuard]
            },
        ]
    },
    {
        path: '**',
        loadComponent: async () =>
            (await import('./views/shared/not-found/not-found')).NotFound
    }
];