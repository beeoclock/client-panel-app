import {Routes} from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./pages/list')
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
        loadComponent: () => import('./pages/form'),
      },
      {
        path: ':id',
        loadComponent: () => import('./pages/form'),
      }
    ]
  }
] as Routes;
