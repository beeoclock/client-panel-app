import {bootstrapApplication} from '@angular/platform-browser';
import {AppComponent} from '@src/app.component';
import {enableProdMode, importProvidersFrom} from '@angular/core';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {environment} from '@src/environment/environment';
import {connectAuthEmulator, getAuth, provideAuth} from '@angular/fire/auth';
import {HttpClient, provideHttpClient, withInterceptors} from '@angular/common/http';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {PreloadAllModules, provideRouter, withInMemoryScrolling, withPreloading} from '@angular/router';
import {routes} from '@src/routers';
import {browserLocalPersistence} from "@firebase/auth";
import {NgxsModule} from "@ngxs/store";
import {NgxsReduxDevtoolsPluginModule} from "@ngxs/devtools-plugin";
import {IonicModule} from "@ionic/angular";
import {Utility} from "@utility/index";
import {initRuntimeEnvironment} from "@src/runtime.environment";
import {IdentityState} from "@identity/state/identity/identity.state";
import {AppState} from "@utility/state/app/app.state";
import {CacheState} from "@utility/state/cache/cache.state";
import {NgxIndexedDBModule} from "ngx-indexed-db";
import {provideEnvironmentNgxMask} from "ngx-mask";
import {MAIN_CONTAINER_ID, SIDEBAR_ID} from "@src/token";
// import '@angular/common/locales/global/pl';
// import '@angular/common/locales/global/uk';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './asset/i18n/', '.json');
}

if (environment.production) {
  enableProdMode();
}

initRuntimeEnvironment();

bootstrapApplication(AppComponent, {
  providers: [

    // {
    //   provide: LOCALE_ID,
    //   useValue: 'uk'
    // },

    {
      provide: SIDEBAR_ID,
      useValue: 'main-sidebar'
    },

    {
      provide: MAIN_CONTAINER_ID,
      useValue: 'main-container'
    },

    provideEnvironmentNgxMask(),

    importProvidersFrom(
      NgxsModule.forRoot([IdentityState, AppState, CacheState], {
        developmentMode: !environment.production
      }),

      NgxsReduxDevtoolsPluginModule.forRoot({
        disabled: environment.production
      }),
    ),

    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled'
      }),
      // TODO check if the strategy does not slow down first download
      withPreloading(PreloadAllModules)
    ),

    provideHttpClient(
      withInterceptors([
        // Utility.Interceptors.Approval, // TODO find way how to handle firebase network!
        // Utility.Interceptors.Loading,
        // Utility.Interceptors.Notification,
        // Utility.Interceptors.Error,


        Utility.Interceptors.AccessTokenInterceptor,
        Utility.Interceptors.PrepareLocalHeadersInterceptor,
        Utility.Interceptors.ApprovalInterceptor,
        Utility.Interceptors.ParamsReplaceInterceptor,
        Utility.Interceptors.LoadingInterceptor,
        Utility.Interceptors.NotificationInterceptor,
        Utility.Interceptors.ErrorInterceptor,
        Utility.Interceptors.SourceInterceptor,
        Utility.Interceptors.ClearLocalHeadersInterceptor,
      ]),
    ),

    importProvidersFrom(
      NgxIndexedDBModule.forRoot(environment.config.database),
      IonicModule.forRoot({
        mode: 'ios',
        animated: false
      }),
      provideFirebaseApp(() => initializeApp(environment.firebase.options)),
      provideAuth(() => {
        const auth = getAuth();
        auth.setPersistence(browserLocalPersistence)
          .catch((error) => {
            console.log(error);
          });
        if (environment.firebase.emulator.all || environment.firebase.emulator.authorization) {
          connectAuthEmulator(auth, 'http://localhost:9099');
        }
        return auth;
      }),
      TranslateModule.forRoot({
        useDefaultLang: true,
        defaultLanguage: environment.config.language,
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      }),
    ),
  ]
}).catch(e => console.error(e));
