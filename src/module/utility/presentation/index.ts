import {Route} from '@angular/router';

export const routers = [
  // {
  //   path: '404',
  //   loadComponent: () => import('./page/404')
  // },
  {
    path: '',
    loadComponent: () => import('./page/dashboard')
  }
] as Route[];
