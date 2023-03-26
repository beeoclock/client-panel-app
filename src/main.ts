// import {HttpLoaderFactory} from './app.module';
import {bootstrapApplication} from '@angular/platform-browser';
import {AppComponent} from '@src/app.component';
import {enableProdMode, importProvidersFrom} from '@angular/core';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {environment} from '@environments/environment';
import {Auth, browserSessionPersistence, getAuth, provideAuth} from '@angular/fire/auth';
import {getFirestore, provideFirestore} from '@angular/fire/firestore';
import {HttpClient, provideHttpClient} from '@angular/common/http';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {provideRouter, withInMemoryScrolling} from '@angular/router';
import {routes} from '@src/routers';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
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
