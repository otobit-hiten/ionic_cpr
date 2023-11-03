import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) =>m.routes)
  },
  {
    path: 'tabs/dashboard/form/location/:map/:id1',
    loadComponent: () => import('./location/location.page').then(m => m.LocationPage)
  },  {
    path: 'thank',
    loadComponent: () => import('./thank/thank.page').then( m => m.ThankPage)
  }


];
