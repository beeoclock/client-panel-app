// import {HttpLoaderFactory} from './app.module';
import {bootstrapApplication, BrowserModule} from '@angular/platform-browser';
import {AppComponent} from '@src/app.component';
import {enableProdMode, importProvidersFrom} from '@angular/core';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {environment} from '@environments/environment';
import {getAuth, provideAuth} from '@angular/fire/auth';
import {getFirestore, provideFirestore} from '@angular/fire/firestore';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {provideRouter, Routes} from '@angular/router';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/identity',
  },
  {
    path: 'identity',
    // canActivate: [AuthorizationGuard],
    loadChildren: () => import('@identity/presentation/router')
  },
  {
    path: 'utility/not-found',
    loadChildren: () => import('@utility/presentation/router')
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

    BrowserModule,
    HttpClientModule,
    importProvidersFrom(TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }))
  ]
})
