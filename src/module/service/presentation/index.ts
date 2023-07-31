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
        path: 'form',
        loadComponent: () => import('./page/form/v2'),
      },
      {
        path: ':id',
        resolve: {
          item: serviceDetailsResolver
        },
        children: [
          {
            path: '',
            loadComponent: () => import('./page/details')
          },
          {
            path: 'form',
            loadComponent: () => import('./page/form/v2'),
          }
        ]
      },
    ]
  }
] as Routes;
