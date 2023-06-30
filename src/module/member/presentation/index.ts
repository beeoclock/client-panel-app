import {Routes} from "@angular/router";
import {memberDetailsResolver} from "@member/resolver/member.details.resolver";

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
          item: memberDetailsResolver
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
          item: memberDetailsResolver
        },
        loadComponent: () => import('./page/form'),
      }
    ]
  }
] as Routes;
