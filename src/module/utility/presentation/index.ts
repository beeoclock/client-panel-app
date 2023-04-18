import {Route} from '@angular/router';

export default [
  {
    path: '404',
    loadComponent: () => import('./page/404')
  }
] as Route[];
