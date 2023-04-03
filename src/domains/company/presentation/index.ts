import {Routes} from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./pages/settings')
  }
] as Routes;
