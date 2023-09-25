import {Routes} from '@angular/router';
import WrapperPanelComponent from '@utility/presentation/component/wrapper-panel/wrapper-panel.component';
import {AuthGuard, redirectUnauthorizedTo} from '@angular/fire/auth-guard';
import {clientIdResolver} from "@utility/presentation/resolver/client-id.resolver";

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['identity']);

export const routes: Routes = [
  {
    path: '',
    component: WrapperPanelComponent,
    canActivate: [AuthGuard],
    data: {
      authGuardPipe: redirectUnauthorizedToLogin
    },
    resolve: {
      clientId: clientIdResolver,
    },
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
        path: 'member',
        loadChildren: () => import('@member/index')
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
        path: 'client',
        loadChildren: () => import('@module/client/index')
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
		loadChildren: () => import('@identity/index')
  },
  {
    path: '404',
    loadComponent: () => import('@utility/presentation/page/404')
  },
  {
    path: '**',
    redirectTo: '/',
  }
];
