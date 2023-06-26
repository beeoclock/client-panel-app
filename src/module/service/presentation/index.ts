import {Routes} from "@angular/router";
import {serviceDetailsResolver} from "@service/resolver/service.details.resolver";

export const routers = [
  {
    path: '',
    loadComponent: () => import('./page/list')
  },
  {
    path: 'details',
    children: [
      {
        path: ':id',
        resolve: {
          item: serviceDetailsResolver
        },
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
        resolve: {
          item: serviceDetailsResolver
        },
        loadComponent: () => import('./page/form'),
      }
    ]
  }
] as Routes;
