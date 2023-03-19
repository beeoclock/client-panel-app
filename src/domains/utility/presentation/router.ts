import {Route} from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./pages/not-found/page')
  }
] as Route[];
