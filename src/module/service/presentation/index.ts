import {Routes} from "@angular/router";
import {serviceDetailsResolver} from "@service/resolver/service.details.resolver";
import {serviceListResolver} from "@service/resolver/service.list.resolver";

export const routers = [
  {
    path: '',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    resolve: {
      items: serviceListResolver
    },
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
