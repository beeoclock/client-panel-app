import {inject, Injectable} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {is} from "@core/shared/checker";

export type Formats = 'short' | 'medium' | 'shortDate' | 'time' | 'hhMM' | 'shortWithOutSeconds';

export const predefinedFormats: Record<Formats, Intl.DateTimeFormatOptions> = {
	short: {
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hourCycle: 'h23'
	},
	shortWithOutSeconds: {
		hour: '2-digit',
		minute: '2-digit',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hourCycle: 'h23'
	},
	medium: {
		timeStyle: 'medium',
		dateStyle: 'medium',
		hourCycle: 'h23'
	},
	time: {
		timeStyle: 'medium',
		hourCycle: 'h23'
	},
	hhMM: {
		timeStyle: 'short',
		hourCycle: 'h23'
	},
	shortDate: {
		dateStyle: 'short',
		hourCycle: 'h23'
	}
}

@Injectable({
	providedIn: 'root'
})
export class DynamicDateHelper {

	private readonly translateService = inject(TranslateService);

	public transform(value: string, format: Formats = 'short') {
		if (is.not_string(value)) {
			return '';
		}
		return new Intl.DateTimeFormat(this.translateService.getCurrentLang(), predefinedFormats[format]).format(new Date(value));
	}

}
