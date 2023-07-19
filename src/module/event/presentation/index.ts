import {Routes} from "@angular/router";
import {eventDetailsResolver} from "@event/resolver/event.details.resolver";
import {eventCacheResolver} from "@event/resolver/event.cache.resolver";

export const routers = [
  {
    path: '',
    resolve: {
      cacheLoaded: eventCacheResolver
    },
    children: [
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
            resolve: {
              item: eventDetailsResolver
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
              item: eventDetailsResolver
            },
            loadComponent: () => import('./page/form'),
          }
        ]
      }
    ]
  }
] as Routes;
