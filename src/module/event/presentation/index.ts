import {Routes} from "@angular/router";
import {eventDetailsResolver} from "@event/resolver/event.details.resolver";
import {eventListResolver} from "@event/resolver/event.list.resolver";

export const routers = [
  {
    path: '',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    resolve: {
      items: eventListResolver
    },
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
] as Routes;
