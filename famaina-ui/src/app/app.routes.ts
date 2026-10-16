import { Routes } from '@angular/router';
import { Instalive } from './instalive/instalive';
import { Home } from './home/home';

export const routes: Routes = [
    {
        path:'',
        component: Home
    },
    {
        path: 'insta',
        component: Instalive
    },
    {
        path: 'tiktok',
        component: Instalive
    },
    {
        path: 'youtube',
        component: Instalive
    },
    {
        path: '**',
        pathMatch: 'full',
        redirectTo: '/'
    }
];
