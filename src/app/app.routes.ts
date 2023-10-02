import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) =>m.routes)
  },
  {
    path: 'important-tips',
    loadComponent: () => import('./important-tips/important-tips.page').then( m => m.ImportantTipsPage)
  },
  {
    path: 'contact-us',
    loadComponent: () => import('./contact-us/contact-us.page').then( m => m.ContactUsPage)
  }
];
