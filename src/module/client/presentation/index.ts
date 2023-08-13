import {Routes} from "@angular/router";
import {clientDetailsResolver} from "@client/resolver/client.details.resolver";

export const routers = [
  {
    path: 'business-profile',
    resolve: {
      item: clientDetailsResolver
    },
    loadComponent: () => import('./page/business-profile')
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
