import {bootstrapApplication, HammerModule} from '@angular/platform-browser';
import {MainRouterOutlet} from '@src/main.router-outlet';
import {enableProdMode, ErrorHandler, importProvidersFrom, isDevMode, provideZoneChangeDetection} from '@angular/core';
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
import {
	PreloadAllModules,
	provideRouter,
	withComponentInputBinding,
	withInMemoryScrolling,
	withPreloading
} from '@angular/router';
import {routes} from '@src/routers';
import {browserLocalPersistence} from "@firebase/auth";
import {IonicModule} from "@ionic/angular";
import {Utility} from "@utility/index";
import {initRuntimeEnvironment} from "@src/runtime.environment";
import {provideEnvironmentNgxMask} from "ngx-mask";
import {tokens} from "@src/token";
import {LoggerModule, NgxLoggerLevel} from "ngx-logger";
import {provideServiceWorker} from '@angular/service-worker';
import {LanguageCodeEnum} from "@utility/domain/enum";
import {NgEventBus} from 'ng-event-bus';
import {getMessaging, provideMessaging} from "@angular/fire/messaging";
import {getAnalytics, provideAnalytics} from "@angular/fire/analytics";
import {ngxsProviders} from "@src/ngxs";
import * as Sentry from "@sentry/angular";

import 'hammerjs';

import '@angular/common/locales/global/da';
import '@angular/common/locales/global/pl';
import '@angular/common/locales/global/uk';
import {SocketIoModule} from "ngx-socket-io";

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
	return new TranslateHttpLoader(http, './asset/i18n/', '.json');
}

if (environment.production) {
	enableProdMode();
}

initRuntimeEnvironment();

Sentry.init({
	dsn: "https://23c78c6bf4b43dfdb0bc7569e3e0195c@o4508184180686848.ingest.de.sentry.io/4508184181997648",
	integrations: [
		Sentry.browserTracingIntegration(),
		Sentry.replayIntegration(),
	],
	// Tracing
	tracesSampleRate: 1.0, //  Capture 100% of the transactions
	// Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
	tracePropagationTargets: ["localhost", /^https:\/\/api\.dev\.beeoclock\.com/, /^https:\/\/api\.beeoclock\.com/],
	// Session Replay
	replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
	replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

bootstrapApplication(MainRouterOutlet, {
	providers: [
		...tokens,
		NgEventBus,
		provideZoneChangeDetection({
			eventCoalescing: true,
			runCoalescing: true,

		}),
		provideEnvironmentNgxMask(),
		provideFirebaseApp(() =>
			initializeApp(environment.firebase.options)
		),
		provideAnalytics(() => getAnalytics()),
		provideMessaging(() => getMessaging()),
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
		importProvidersFrom(
			HammerModule,
			LoggerModule.forRoot({
				level: environment.production ? NgxLoggerLevel.OFF : NgxLoggerLevel.TRACE,
				serverLogLevel: NgxLoggerLevel.OFF,
			}),
			...ngxsProviders,
			IonicModule.forRoot({
				mode: 'ios',
				animated: false,
				rippleEffect: false,
				innerHTMLTemplatesEnabled: true,
			}),
			SocketIoModule,
			TranslateModule.forRoot({
				useDefaultLang: true,
				defaultLanguage: LanguageCodeEnum.en,
				loader: {
					provide: TranslateLoader,
					useFactory: HttpLoaderFactory,
					deps: [HttpClient]
				}
			}),
		),
		{
			provide: HTTP_INTERCEPTORS,
			useClass: Utility.Interceptors.NotificationInterceptor,
			multi: true
		},
		provideHttpClient(withInterceptorsFromDi(), withInterceptors([
			// Utility.Interceptors.Loading,
			Utility.Interceptors.PrepareHttpContextInterceptor,
			Utility.Interceptors.ApprovalInterceptor, // TODO find way how to handle firebase network!
			Utility.Interceptors.ParamsReplaceInterceptor,
			Utility.Interceptors.ErrorInterceptor,
			Utility.Interceptors.SourceInterceptor,
			Utility.Interceptors.TenantIdInterceptor,
			Utility.Interceptors.AccessTokenInterceptor,
			Utility.Interceptors.NotificationSettingsInterceptor
		])),
		provideRouter(
			routes,
			withInMemoryScrolling({
				scrollPositionRestoration: 'enabled'
			}),
			withPreloading(PreloadAllModules),
			// withViewTransitions(), // TODO add when we will control which container should have animation
			withComponentInputBinding(),
		),
		provideServiceWorker('ngsw-worker.js', {
			enabled: !isDevMode(),
			registrationStrategy: 'registerWhenStable:30000'
		}),
		{
			provide: ErrorHandler,
			useValue: Sentry.createErrorHandler(),
		},
	]
}).then((ref) => {

	// Ensure Angular destroys itself on hot reloads.
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error
	window["ngRef"]?.destroy();
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error
	window["ngRef"] = ref;

}).catch(e => console.error(e));
