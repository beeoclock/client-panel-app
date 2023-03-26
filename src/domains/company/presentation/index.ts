import {Routes} from '@angular/router';

export default [
  {
    path: 'list',
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
        loadComponent: () => import('./pages/details'),
      },
      {
        path: ':id',
        loadComponent: () => import('./pages/details'),
      }
    ]
  }
] as Routes;