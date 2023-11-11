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
import {tokens} from "@src/token";
import {LoggerModule, NgxLoggerLevel} from "ngx-logger";
import {provideServiceWorker} from '@angular/service-worker';
import {LanguageCodeEnum} from "@utility/domain/enum";
// import '@angular/common/locales/global/pl';
import '@angular/common/locales/global/uk';
import {ClientState} from "@client/state/client/client.state";

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
		...tokens,
		provideEnvironmentNgxMask(),
		importProvidersFrom(
			LoggerModule.forRoot({
				level: environment.production ? NgxLoggerLevel.OFF : NgxLoggerLevel.TRACE,
				serverLogLevel: NgxLoggerLevel.OFF,
			}),
			NgxsModule.forRoot([IdentityState, AppState, CacheState, ClientState], {
				developmentMode: !environment.production
			}),
			NgxsReduxDevtoolsPluginModule.forRoot({
				disabled: environment.production
			}),
			NgxIndexedDBModule.forRoot(environment.config.database), IonicModule.forRoot({
				mode: 'ios',
				animated: false
			}),
			provideFirebaseApp(() =>
				initializeApp(environment.firebase.options)
			),
			provideAuth(() => {
				const auth = getAuth();
				auth.setPersistence(browserLocalPersistence)
					.catch((error) => {
						console.error(error);
					});
				if (environment.firebase.emulator.all || environment.firebase.emulator.authorization) {
					connectAuthEmulator(auth, 'http://localhost:9099');
				}
				return auth;
			}),
			TranslateModule.forRoot({
				useDefaultLang: true,
				defaultLanguage: LanguageCodeEnum.uk,
				loader: {
					provide: TranslateLoader,
					useFactory: HttpLoaderFactory,
					deps: [HttpClient]
				}
			})
		),
		{
			provide: HTTP_INTERCEPTORS,
			useClass: Utility.Interceptors.NotificationInterceptor,
			multi: true
		},
		provideHttpClient(withInterceptorsFromDi(), withInterceptors([
			// Utility.Interceptors.Loading,
			Utility.Interceptors.PrepareLocalHeadersInterceptor,
			Utility.Interceptors.ApprovalInterceptor, // TODO find way how to handle firebase network!
			Utility.Interceptors.ParamsReplaceInterceptor,
			Utility.Interceptors.ErrorInterceptor,
			Utility.Interceptors.SourceInterceptor,
			Utility.Interceptors.AccessTokenInterceptor,
			Utility.Interceptors.ClearLocalHeadersInterceptor,
		])),
		provideRouter(
			routes,
			withInMemoryScrolling({
				scrollPositionRestoration: 'enabled'
			}),
			withPreloading(PreloadAllModules)
		),
		provideServiceWorker('ngsw-worker.js', {
			enabled: !isDevMode(),
			registrationStrategy: 'registerWhenStable:30000'
		})
	]
}).catch(e => console.error(e));
