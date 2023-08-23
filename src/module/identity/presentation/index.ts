import {Route} from '@angular/router';
import {AuthGuard, redirectLoggedInTo, redirectUnauthorizedTo} from "@angular/fire/auth-guard";
import {tokenResolver} from "@utility/resolver/token.resolver";

const redirectLoggedInToSendEmail = () => redirectLoggedInTo(['/', 'identity', 'corridor']);
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/', 'identity']);

export const routers = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      authGuardPipe: redirectLoggedInToSendEmail
    },
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
    resolve: {
      clientId: tokenResolver,
    },
    loadComponent: () => import('./page/corridor')
  },
  {
    path: 'create-business',
    resolve: {
      clientId: tokenResolver,
    },
    loadComponent: () => import('./page/create-business')
  },
] as Route[];
