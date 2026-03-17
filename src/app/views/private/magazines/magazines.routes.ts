import { Routes } from '@angular/router'
import { Article } from '../article/article';
export const routes: Routes = [
    {
        path: 'article/:slug',
        component: Article,
    }
];