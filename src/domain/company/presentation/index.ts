import {Routes} from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./page/settings')
  }
] as Routes;
