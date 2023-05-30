import {Routes} from "@angular/router";
import {eventDetailsResolver} from "@event/resolver/event.details.resolver";

export const routers = [
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
        loadComponent: () => import('./page/form'),
      }
    ]
  }
] as Routes;
