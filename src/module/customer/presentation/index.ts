import {Routes} from "@angular/router";
import {customerDetailsResolver} from "@customer/resolver/customer.details.resolver";
import {customerListResolver} from "@customer/resolver/customer.list.resolver";

export const routers = [
  {
    path: '',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    resolve: {
      items: customerListResolver
    },
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
        loadComponent: () => import('./page/form'),
      }
    ]
  }
] as Routes;
