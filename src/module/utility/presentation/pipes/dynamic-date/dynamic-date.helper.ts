import {inject, Injectable} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {is} from "thiis";

export type Formats = 'short' | 'medium' | 'shortDate' | 'time' | 'hhMM';

export const predefinedFormats: Record<Formats, Intl.DateTimeFormatOptions> = {
	short: {
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hourCycle: 'h24'
	},
	medium: {
		timeStyle: 'medium',
		dateStyle: 'medium',
		hourCycle: 'h24'
	},
	time: {
		timeStyle: 'medium',
		hourCycle: 'h24'
	},
	hhMM: {
		timeStyle: 'short',
		hourCycle: 'h24'
	},
	shortDate: {
		dateStyle: 'short',
		hourCycle: 'h24'
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
		return new Intl.DateTimeFormat(this.translateService.currentLang, predefinedFormats[format]).format(new Date(value));
	}

}
