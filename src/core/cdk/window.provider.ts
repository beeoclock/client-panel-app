import {isPlatformBrowser} from "@angular/common";
import {ClassProvider, FactoryProvider, InjectionToken, PLATFORM_ID} from '@angular/core';

/* Create a new injection token for injecting the window into a component. */
export const WINDOW = new InjectionToken<typeof window>('WindowToken');

/* Define abstract class for obtaining reference to the global window object. */
export abstract class WindowRef {

	get nativeWindow(): Window | NonNullable<unknown> {
		throw new Error('Not implemented.');
	}

}

/* Define class that implements the abstract class and returns the native window object. */
export class BrowserWindowRef extends WindowRef {

	constructor() {
		super();
	}

	public override get nativeWindow(): Window | NonNullable<unknown> {
		return window;
	}

}

/* Create a factory function that returns the native window object. */
export function windowFactory(browserWindowRef: BrowserWindowRef, platformId: NonNullable<unknown>): Window | NonNullable<unknown> {
	if (isPlatformBrowser(platformId)) {
		return browserWindowRef.nativeWindow;
	}
	return {};
}

/* Create a injectable provider for the WindowRef token that uses the BrowserWindowRef class. */
const browserWindowProvider: ClassProvider = {
	provide: WindowRef,
	useClass: BrowserWindowRef
};

/* Create an injectable provider that uses the windowFactory function for returning the native window object. */
const windowProvider: FactoryProvider = {
	provide: WINDOW,
	useFactory: windowFactory,
	deps: [ WindowRef, PLATFORM_ID ]
};

/* Create an array of providers. */
export const WINDOW_PROVIDERS = [
	browserWindowProvider,
	windowProvider
];
