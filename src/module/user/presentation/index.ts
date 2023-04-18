import {Routes} from '@angular/router';

export default [
  {
    path: 'list',
    loadComponent: () => import('./page/list')
  },
  {
    path: 'details',
    children: [
      {
        path: ':id',
        loadComponent: () => import('./page/details')
      }
    ]
  },
  {
    path: 'form',
    children: [
      {
        path: '',
        loadComponent: () => import('./page/details'),
      },
      {
        path: ':id',
        loadComponent: () => import('./page/details'),
      }
    ]
  }
] as Routes;
