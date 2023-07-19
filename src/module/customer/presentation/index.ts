import {Routes} from "@angular/router";
import {customerDetailsResolver} from "@customer/resolver/customer.details.resolver";
import {CustomerWrapperComponent} from "@customer/presentation/component/wrapper/customer.wrapper.component";
import {customerCacheResolver} from "@customer/resolver/customer.cache.resolver";

export const routers = [
  {
    path: '',
    component: CustomerWrapperComponent,
    resolve: {
      cacheLoaded: customerCacheResolver
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
              itemLoaded: customerDetailsResolver
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
              itemLoaded: customerDetailsResolver
            },
            loadComponent: () => import('./page/form'),
          }
        ]
      }
    ]
  }
] as Routes;
