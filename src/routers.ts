import {Routes} from '@angular/router';
import WrapperPanelComponent from '@utility/presentation/component/wrapper-panel/wrapper-panel.component';
import WrapperIdentityComponent from '@utility/presentation/component/wrapper-identity/wrapper-identity.component';
import {AuthGuard, redirectUnauthorizedTo} from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['identity']);

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
        loadChildren: () => import('@utility/index')
      },
      {
        path: 'employee',
        loadChildren: () => import('@employee/index')
      },
      {
        path: 'user',
        loadChildren: () => import('@user/presentation')
      },
      {
        path: 'event',
        loadChildren: () => import('@event/index')
      },
      {
        path: 'company',
        loadChildren: () => import('@company/index')
      },
      {
        path: 'customer',
        loadChildren: () => import('@customer/index')
      },
      {
        path: 'service',
        loadChildren: () => import('@service/index')
      },
    ]
  },
  {
    path: 'identity',
    component: WrapperIdentityComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('@identity/index')
      },
    ]
  },
  {
    path: '**',
    redirectTo: '/',
  }
];
