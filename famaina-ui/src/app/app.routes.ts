import { Routes } from '@angular/router';
import { Instalive } from './instalive/instalive';
import { Home } from './home/home';
import { Youtubelive } from './youtubelive/youtubelive';

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
        component: Home
    },
    {
        path: 'youtube',
        component: Youtubelive
    },
    {
        path: '**',
        pathMatch: 'full',
        redirectTo: '/'
    }
];
