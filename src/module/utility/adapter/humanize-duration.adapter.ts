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

	public formatISO(iso: string): string {
		return humanizeDuration(
			Duration.fromISO(iso).as('milliseconds'),
			{
				language: this.translateService.currentLang
			}
		);
	}

	public fromSeconds(durationSeconds: number): string {
		return humanizeDuration(
			durationSeconds * 1000,
			{
				language: this.translateService.currentLang
			}
		);
	}

}
