import { type Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'dashboard',
        loadComponent: async () => (await import('./pages/dashboard-page')).DashboardPageComponent
    },
    {
        path: '**',
        redirectTo: 'dashboard'
    }
];
