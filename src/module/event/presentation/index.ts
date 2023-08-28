import {Routes} from "@angular/router";
import {eventDetailsResolver} from "@event/presentation/resolver/event.details.resolver";
import {eventCacheResolver} from "@event/presentation/resolver/event.cache.resolver";

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
        path: 'form',
        loadComponent: () => import('./page/form'),
      },
      {
        path: ':id',
        resolve: {
          item: eventDetailsResolver
        },
        children: [
          {
            path: '',
            loadComponent: () => import('./page/details')
          },
          {
            path: 'form',
            loadComponent: () => import('./page/form'),
          },
          {
            path: 'repeat',
            data: {
              repeat: true
            },
            loadComponent: () => import('./page/form'),
          }
        ]
      },
    ]
  }
] as Routes;
