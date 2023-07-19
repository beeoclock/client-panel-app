import {Routes} from "@angular/router";
import {serviceDetailsResolver} from "@service/resolver/service.details.resolver";
import {serviceCacheResolver} from "@service/resolver/service.cache.resolver";

export const routers = [
  {
    path: '',
    resolve: {
      cacheLoaded: serviceCacheResolver,
    },
    children: [
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
    ]
  }
] as Routes;
