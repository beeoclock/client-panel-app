import {InjectionToken, LOCALE_ID} from "@angular/core";
import {MS_TEN_MINUTES} from "@utility/domain/const/c.time";

export const SIDEBAR_ID = new InjectionToken<string>('SIDEBAR_ID');
export const MAIN_CONTAINER_ID = new InjectionToken<string>('MAIN_CONTAINER_ID');
export const CACHE_TABLE_CLEAR_AFTER_MS = new InjectionToken<number>('CACHE_TABLE_CLEAR_AFTER_MS');


export const tokens = [
	{
		provide: LOCALE_ID,
		useValue: 'uk'
	},
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
		useValue: MS_TEN_MINUTES
	}
]
