import {Routes} from "@angular/router";
import {customerDetailsResolver} from "@customer/resolver/customer.details.resolver";

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
          item: customerDetailsResolver
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
          item: customerDetailsResolver
        },
        loadComponent: () => import('./page/form'),
      }
    ]
  }
] as Routes;
