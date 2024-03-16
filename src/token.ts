import {InjectionToken, LOCALE_ID} from "@angular/core";
import {MS_TEN_MINUTES} from "@utility/domain/const/c.time";
import {LanguageCodeEnum} from "@utility/domain/enum";
import {ThemeEnum} from "@utility/cdk/theme.service";
import {BehaviorSubject} from "rxjs";

export const THEME = new InjectionToken<BehaviorSubject<ThemeEnum>>('THEME');
export const ACCESS_TOKEN = new InjectionToken<BehaviorSubject<string | null>>('ACCESS_TOKEN');
export const TENANT_ID = new InjectionToken<BehaviorSubject<string | null>>('TENANT_ID');

export const SIDEBAR_ID = new InjectionToken<string>('SIDEBAR_ID');
export const MAIN_CONTAINER_ID = new InjectionToken<string>('MAIN_CONTAINER_ID');
export const CACHE_TABLE_CLEAR_AFTER_MS = new InjectionToken<number>('CACHE_TABLE_CLEAR_AFTER_MS');


export const tokens = [
	{
		provide: LOCALE_ID,
		useValue: LanguageCodeEnum.en
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
	},
	{
		provide: THEME, // New
		useValue: new BehaviorSubject('light')
	},
	{
		provide: ACCESS_TOKEN, // New
		useValue: new BehaviorSubject(null)
	},
	{
		provide: TENANT_ID, // New
		useValue: new BehaviorSubject(null)
	}
]
