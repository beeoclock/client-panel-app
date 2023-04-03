import {bootstrapApplication} from '@angular/platform-browser';
import {AppComponent} from '@src/app.component';
import {enableProdMode, importProvidersFrom} from '@angular/core';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {environment} from '@environments/environment';
import {Auth, browserSessionPersistence, getAuth, provideAuth} from '@angular/fire/auth';
import {getFirestore, provideFirestore} from '@angular/fire/firestore';
import {HttpClient, provideHttpClient, withInterceptors} from '@angular/common/http';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {provideRouter, withInMemoryScrolling} from '@angular/router';
import {routes} from '@src/routers';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled'
      })
    ),

    provideHttpClient(
      withInterceptors([
        // Utility.Interceptors.Approval, // TODO find way how to handle firebase network!
        // Utility.Interceptors.Loading,
        // Utility.Interceptors.Notification,
        // Utility.Interceptors.Error,
      ]),
    ),

    importProvidersFrom(provideFirebaseApp(() => initializeApp(environment.firebase))),
    importProvidersFrom(provideAuth(() => {
      const auth: Auth = getAuth();
      auth.setPersistence(browserSessionPersistence)
        .catch((error) => {
          console.log(error);
        });
      return auth;
    })),
    importProvidersFrom(provideFirestore(() => getFirestore())),

    importProvidersFrom(TranslateModule.forRoot({
      useDefaultLang: true,
      defaultLanguage: environment.config.language,
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }))
  ]
}).catch(e => console.error(e));
