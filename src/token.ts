import {InjectionToken, LOCALE_ID} from "@angular/core";
import {MS_TEN_MINUTES} from "@utility/domain/const/c.time";
import {CurrencyCodeEnum, LanguageCodeEnum} from "@utility/domain/enum";
import {ThemeEnum} from "@utility/cdk/theme.service";
import {BehaviorSubject} from "rxjs";

export const THEME = new InjectionToken<BehaviorSubject<ThemeEnum>>('THEME');
export const ACCESS_TOKEN = new InjectionToken<BehaviorSubject<string | null>>('ACCESS_TOKEN');
export const TENANT_ID = new InjectionToken<BehaviorSubject<string | null>>('TENANT_ID');
export const LAST_OPENED_TENANT_ID_MAP_BY_LOGIN = new InjectionToken<BehaviorSubject<Map<string, string>>>('LAST_OPENED_TENANT_ID_MAP_BY_LOGIN');
export const BASE_CURRENCY = new InjectionToken<BehaviorSubject<CurrencyCodeEnum | null>>('BASE_CURRENCY');

export const SIDEBAR_ID = new InjectionToken<string>('SIDEBAR_ID');
export const MAIN_CONTAINER_ID = new InjectionToken<string>('MAIN_CONTAINER_ID');
export const CACHE_TABLE_CLEAR_AFTER_MS = new InjectionToken<number>('CACHE_TABLE_CLEAR_AFTER_MS');


export const tokens = [
	{
		provide: LOCALE_ID,
		useFactory: () => {
			const selectedLanguageCode = localStorage.getItem('language');
			return selectedLanguageCode ?? LanguageCodeEnum.en;
		},
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
		provide: THEME,
		useValue: new BehaviorSubject('light')
	},
	{
		provide: ACCESS_TOKEN,
		useValue: new BehaviorSubject(null)
	},
	{
		provide: TENANT_ID,
		useValue: new BehaviorSubject(null)
	},
	{
		provide: LAST_OPENED_TENANT_ID_MAP_BY_LOGIN,
		useFactory: () => {
			const data = localStorage.getItem('lastOpenedTenantIdMapByLogin');
			if (data) {
				return new BehaviorSubject(new Map(JSON.parse(data)));
			}
			return new BehaviorSubject(new Map());
		},
	},
	{
		provide: BASE_CURRENCY,
		useValue: new BehaviorSubject(null)
	}
]
