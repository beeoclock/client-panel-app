import {Routes} from '@angular/router';

export default [
  {
    path: 'profile',
    loadComponent: () => import('./page/profile')
  },
  {
    path: 'settings',
    loadComponent: () => import('./page/settings')
  }
] as Routes;
