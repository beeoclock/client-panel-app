import {InjectionToken} from '@angular/core';
import {BreakpointConfig} from './device.types';

// 🇺🇦 Значення за замовчуванням
export const DEFAULT_BREAKPOINTS: BreakpointConfig = {
	phoneMax: 599,
	tabletMax: 1023,
	computerMax: 1919,
};

export const BREAKPOINTS = new InjectionToken<BreakpointConfig>(
	'BREAKPOINTS_CONFIG',
	{ providedIn: 'root', factory: () => DEFAULT_BREAKPOINTS }
);
