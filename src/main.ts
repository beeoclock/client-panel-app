import {bootstrapApplication} from '@angular/platform-browser';
import {AppComponent} from '@src/app.component';
import {enableProdMode, importProvidersFrom} from '@angular/core';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {environment} from '@src/environment/environment';
import {Auth, connectAuthEmulator, getAuth, provideAuth} from '@angular/fire/auth';
import {connectFirestoreEmulator, getFirestore, provideFirestore} from '@angular/fire/firestore';
import {HttpClient, provideHttpClient, withInterceptors} from '@angular/common/http';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {provideRouter, withInMemoryScrolling} from '@angular/router';
import {routes} from '@src/routers';
import {FlatpickrModule} from 'angularx-flatpickr';
import {connectFunctionsEmulator, getFunctions, provideFunctions} from '@angular/fire/functions';
import {browserLocalPersistence} from "@firebase/auth";

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './asset/i18n/', '.json');
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
      auth.setPersistence(browserLocalPersistence)
        .catch((error) => {
          console.log(error);
        });
      if (environment.emulator) {
        connectAuthEmulator(auth, 'http://localhost:9099');
      }
      return auth;
    })),
    importProvidersFrom(provideFunctions(() => {
      const functions = getFunctions();
      if (environment.emulator) {
        connectFunctionsEmulator(functions, 'localhost', 5001);
      }
      return functions;
    })),
    importProvidersFrom(
      provideFirestore(() => {
        const firestore = getFirestore();
        if (environment.emulator) {
          connectFirestoreEmulator(firestore, 'localhost', 8080);
        }
        return firestore;
      }),
    ),

    importProvidersFrom(FlatpickrModule.forRoot()),

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
