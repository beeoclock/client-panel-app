import {Route} from '@angular/router';

export default [
  {
    path: 'not-found',
    loadComponent: () => import('./pages/not-found')
  },
  {
    path: '404',
    loadComponent: () => import('./pages/404')
  }
] as Route[];
