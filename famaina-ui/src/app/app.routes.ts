import { Routes } from '@angular/router';
import { Home } from './home/home';

export const routes: Routes = [
    {
        path:'',
        component: Home
    },
    {
        path: 'insta',
        loadComponent: () => import('./instalive/instalive').then(m => m.Instalive)
    },
    {
        path: 'tiktok',
        component: Home
    },
    {
        path: 'youtube',
        loadComponent: () => import('./youtubelive/youtubelive').then(m => m.Youtubelive)
    },
    {
        path: '**',
        pathMatch: 'full',
        redirectTo: '/'
    }
];
