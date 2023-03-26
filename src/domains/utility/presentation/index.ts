import {Route} from '@angular/router';

export default [
  {
    path: '404',
    loadComponent: () => import('./pages/404')
  }
] as Route[];
