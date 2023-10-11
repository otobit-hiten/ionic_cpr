import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) =>m.routes)
  },
  {
    path: 'form',
    loadComponent: () => import('./form/form.page').then( m => m.FormPage)
  },  {
    path: 'emergency-services',
    loadComponent: () => import('./emergency-services/emergency-services.page').then( m => m.EmergencyServicesPage)
  }

];
