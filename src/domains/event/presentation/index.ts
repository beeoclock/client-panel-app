import {Routes} from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./pages/list')
  },
  {
    path: 'calendar',
    loadComponent: () => import('./pages/calendar')
  },
  {
    path: 'details',
    children: [
      {
        path: ':id',
        loadComponent: () => import('./pages/details')
      }
    ]
  },
  {
    path: 'form',
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/details'),
      },
      {
        path: ':id',
        loadComponent: () => import('./pages/details'),
      }
    ]
  }
] as Routes;
