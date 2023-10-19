import { LocationPage } from './../location/location.page';
import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/tabs/dashboard',
    pathMatch: 'full',
  },
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
        path: 'dashboard',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('../dashboard/dashboard.page').then((m) => m.Dashboard),
          },
          {
            path: 'contact-us',
            loadComponent: () => import('../contact-us/contact-us.page').then(m => m.ContactUsPage)
          },
          {
            path: 'form',
            children: [
              {
                path: '',
                loadComponent: () => import('../form/form.page').then(m => m.FormPage)
              },
              {
                path: 'location',
                loadComponent: () => import('../location/location.page').then(m => m.LocationPage)
              }
            ]
          }
        ]
      },
      {
        path: 'resources',
        children: [
          {
            path: '',
            loadComponent: () => import('../resources/resources.page').then(m => m.ResourcesPage)
          },
          {
            path: 'emergency-services',
            loadComponent: () => import('../emergency-services/emergency-services.page').then(m => m.EmergencyServicesPage)
          },
          {
            path: 'tabs/resources',
            redirectTo: '/tabs/resources',
            pathMatch: 'full'

          }
        ]
      }
    ],
  }
];
