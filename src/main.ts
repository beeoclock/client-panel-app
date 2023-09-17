import {bootstrapApplication} from '@angular/platform-browser';
import {AppComponent} from '@src/app.component';
import {enableProdMode, importProvidersFrom, isDevMode} from '@angular/core';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {environment} from '@src/environment/environment';
import {connectAuthEmulator, getAuth, provideAuth} from '@angular/fire/auth';
import {
	HTTP_INTERCEPTORS,
	HttpClient,
	provideHttpClient,
	withInterceptors,
	withInterceptorsFromDi
} from '@angular/common/http';
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
import {CACHE_TABLE_CLEAR_AFTER_MS, MAIN_CONTAINER_ID, SIDEBAR_ID} from "@src/token";
import {TEN_MINUTES} from "@utility/domain/const/c.time";
import {LoggerModule, NgxLoggerLevel} from "ngx-logger";
import {provideServiceWorker} from '@angular/service-worker';
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
    {
        provide: CACHE_TABLE_CLEAR_AFTER_MS,
        useValue: TEN_MINUTES
    },
    provideEnvironmentNgxMask(),
    importProvidersFrom(LoggerModule.forRoot({
        level: NgxLoggerLevel.INFO,
    }), NgxsModule.forRoot([IdentityState, AppState, CacheState], {
        developmentMode: !environment.production
    }), NgxsReduxDevtoolsPluginModule.forRoot({
        disabled: environment.production
    }), NgxIndexedDBModule.forRoot(environment.config.database), IonicModule.forRoot({
        mode: 'ios',
        animated: false
    }), provideFirebaseApp(() => initializeApp(environment.firebase.options)), provideAuth(() => {
        const auth = getAuth();
        auth.setPersistence(browserLocalPersistence)
            .catch((error) => {
            console.error(error);
        });
        if (environment.firebase.emulator.all || environment.firebase.emulator.authorization) {
            connectAuthEmulator(auth, 'http://localhost:9099');
        }
        return auth;
    }), TranslateModule.forRoot({
        useDefaultLang: true,
        defaultLanguage: environment.config.language,
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
        }
    })),
    {
        provide: HTTP_INTERCEPTORS,
        useClass: Utility.Interceptors.NotificationInterceptor,
        multi: true
    },
    provideHttpClient(withInterceptorsFromDi(), withInterceptors([
        // Utility.Interceptors.Approval, // TODO find way how to handle firebase network!
        // Utility.Interceptors.Loading,
        // Utility.Interceptors.Notification,
        // Utility.Interceptors.Error,
        Utility.Interceptors.AccessTokenInterceptor,
        Utility.Interceptors.PrepareLocalHeadersInterceptor,
        Utility.Interceptors.ApprovalInterceptor,
        Utility.Interceptors.ParamsReplaceInterceptor,
        Utility.Interceptors.ErrorInterceptor,
        Utility.Interceptors.SourceInterceptor,
        Utility.Interceptors.ClearLocalHeadersInterceptor,
    ])),
    provideRouter(routes, withInMemoryScrolling({
        scrollPositionRestoration: 'enabled'
    }),
    // TODO check if the strategy does not slow down first download
    withPreloading(PreloadAllModules)),
    provideServiceWorker('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000'
    })
]
}).catch(e => console.error(e));
