import {inject, Injectable} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import humanizeDuration from "humanize-duration";
import {Duration} from "luxon";

@Injectable({
	providedIn: 'root'
})
export class HumanizeDurationAdapter {

	private readonly translateService = inject(TranslateService);

	public formatDuration(duration: string): string {
		return humanizeDuration(
			Duration.fromISOTime(duration).as('milliseconds'),
			{
				language: this.translateService.currentLang
			}
		);
	}

}
