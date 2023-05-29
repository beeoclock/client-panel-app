import {Routes} from "@angular/router";

export const routers = [
  {
    path: '',
    loadComponent: () => import('./page/list')
  },
  {
    path: 'calendar',
    loadComponent: () => import('./page/calendar')
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
        loadComponent: () => import('./page/form'),
      },
      {
        path: ':id',
        loadComponent: () => import('./page/form'),
      }
    ]
  }
] as Routes;
