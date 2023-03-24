// import {HttpLoaderFactory} from './app.module';
import {bootstrapApplication, BrowserModule} from '@angular/platform-browser';
import {AppComponent} from '@src/app.component';
import {enableProdMode, importProvidersFrom} from '@angular/core';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {environment} from '@environments/environment';
import {getAuth, provideAuth} from '@angular/fire/auth';
import {getFirestore, provideFirestore} from '@angular/fire/firestore';
import {HttpClient, provideHttpClient} from '@angular/common/http';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {provideRouter, Routes} from '@angular/router';
import WrapperPanelComponent from '@utility/presentation/components/wrapper-panel/wrapper-panel.component';
import WrapperIdentityComponent from '@utility/presentation/components/wrapper-identity/wrapper-identity.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

const routes: Routes = [
  {
    path: '',
    component: WrapperPanelComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/identity',
      },
      {
        path: 'utility',
        loadChildren: () => import('@utility/presentation')
      },
      {
        path: 'specialist',
        loadChildren: () => import('@specialist/presentation')
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
    // canActivate: [AuthorizationGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('@identity/presentation')
      },
    ]
  },
  {
    path: '**',
    redirectTo: '/utility/not-found',
  }
];

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),

    importProvidersFrom(provideFirebaseApp(() => initializeApp(environment.firebase))),
    importProvidersFrom(provideAuth(() => getAuth())),
    importProvidersFrom(provideFirestore(() => getFirestore())),

    BrowserModule, // TODO check if is need?
    provideHttpClient(),
    importProvidersFrom(TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }))
  ]
}).catch(e => console.error(e));
