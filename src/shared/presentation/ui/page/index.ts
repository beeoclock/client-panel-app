import {Route} from '@angular/router';

export const routers = [
  // {
  //   path: '404',
  //   loadComponent: () => import('./page/404')
  // },
  {
    path: '',
    loadComponent: () => import('@shared/presentation/ui/page/dashboard')
  }
] as Route[];
