import {Routes} from '@angular/router';
import WrapperPanelComponent from '@utility/presentation/component/wrapper-panel/wrapper-panel.component';
import WrapperIdentityComponent from '@utility/presentation/component/wrapper-identity/wrapper-identity.component';
import {AuthGuard, redirectLoggedInTo, redirectUnauthorizedTo} from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['identity']);
const redirectLoggedInToSendEmail = () => redirectLoggedInTo(['dashboard']);

export const routes: Routes = [
  {
    path: '',
    component: WrapperPanelComponent,
    canActivate: [AuthGuard],
    data: {authGuardPipe: redirectUnauthorizedToLogin},
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/identity',
      },
      {
        path: 'dashboard',
        loadComponent: () => import('@utility/presentation/page/dashboard')
      },
      {
        path: 'employee',
        loadChildren: () => import('@employee/presentation')
      },
      {
        path: 'user',
        loadChildren: () => import('@user/presentation')
      },
      {
        path: 'event',
        loadChildren: () => import('@event/presentation')
      },
      {
        path: 'company',
        loadChildren: () => import('@company/presentation')
      },
      {
        path: 'customer',
        loadChildren: () => import('@customer/presentation')
      },
      {
        path: 'service',
        loadChildren: () => import('@service/presentation')
      },
      {
        path: 'employee',
        loadChildren: () => import('@service/presentation')
      },
    ]
  },
  {
    path: 'identity',
    component: WrapperIdentityComponent,
    canActivate: [AuthGuard],
    data: {authGuardPipe: redirectLoggedInToSendEmail},
    children: [
      {
        path: '',
        loadChildren: () => import('@identity/presentation')
      },
    ]
  },
  {
    path: '',
    loadChildren: () => import('@utility/presentation')
  },
  {
    path: '**',
    redirectTo: '/404',
  }
];
