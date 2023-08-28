import {Routes} from "@angular/router";
import {memberCacheResolver} from "@member/presentation/resolver/member.cache.resolver";
import {memberDetailsResolver} from "@member/presentation/resolver/member.details.resolver";

export const routers = [
  {
    path: '',
    resolve: {
      cacheLoaded: memberCacheResolver,
    },
    children: [
      {
        path: '',
        loadComponent: () => import('./page/list')
      },
      {
        path: 'form',
        loadComponent: () => import('./page/form'),
      },
      {
        path: ':id',
        resolve: {
          item: memberDetailsResolver
        },
        children: [
          {
            path: '',
            loadComponent: () => import('./page/details')
          },
          {
            path: 'form',
            loadComponent: () => import('./page/form'),
          }
        ]
      },
    ]
  },
] as Routes;
