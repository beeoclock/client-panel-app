import {Route} from '@angular/router';
import {AuthGuard, redirectLoggedInTo} from "@angular/fire/auth-guard";

const redirectLoggedInToSendEmail = () => redirectLoggedInTo(['identity/corridor']);

export const routers = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {authGuardPipe: redirectLoggedInToSendEmail},
    children: [
      {
        path: '',
        loadComponent: () => import('./page/sign-in')
      },
      {
        path: 'sign-up',
        loadComponent: () => import('./page/sign-up')
      },
      {
        path: 'reset-password',
        loadComponent: () => import('./page/reset-password')
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./page/forgot-password')
      },
      {
        path: 'confirm-email',
        loadComponent: () => import('./page/confirm-email')
      },
    ]
  },
  {
    path: 'corridor',
    loadComponent: () => import('./page/corridor')
  },
] as Route[];
