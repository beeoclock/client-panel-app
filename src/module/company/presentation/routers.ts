import {Routes} from "@angular/router";

export const routers = [
  {
    path: 'profile',
    loadComponent: () => import('./page/profile')
  },
  {
    path: 'settings',
    loadComponent: () => import('./page/settings')
  },
  {
    path: 'notification',
    children: [
      {
        path: '',
        loadComponent: () => import('./page/notification')
      },
      {
        path: ':id',
        loadComponent: () => import('./page/notification')
      }
    ]
  }
] as Routes;
