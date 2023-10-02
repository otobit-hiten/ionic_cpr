import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'profile',
        loadComponent: () =>
          import('../profile/profile.page').then((m) => m.ProfilePage),
      },
      {
        path: 'company',
        loadComponent: () =>
          import('../company/company.page').then((m) => m.CompanyPage),
      },
      {
        path: 'home',
        loadComponent: () =>
          import('../dashboard/dashboard.page').then((m) => m.Dashboard),
      },
      {
        path: 'resources',
        loadComponent: () => import('../resources/resources.page').then( m => m.ResourcesPage)
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full',
  }
];
