import {inject, Pipe, PipeTransform} from "@angular/core";
import {DateTime} from "luxon";
import {TranslateService} from "@ngx-translate/core";

@Pipe({
	standalone: true,
	name: 'timeAgo',
	pure: false
})
export class TimeAgoPipe implements PipeTransform {

	private readonly translateService = inject(TranslateService);

	/**
	 * Author: Ivan Karbashevskyi
	 * @param value
	 */
	public transform(value: string): string {
		console.log('TimeAgoPipe.transform', value);
		const dateTime = DateTime.fromISO(value);
		return dateTime.toRelative({
			locale: this.translateService.currentLang
		}) ?? '';
	}

}
