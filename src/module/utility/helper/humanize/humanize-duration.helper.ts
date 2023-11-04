import {inject, Injectable} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import humanizeDuration from "humanize-duration";
import {Duration} from "luxon";
import {LanguagesHumanizeDurationHelper} from "@utility/helper/humanize/languages.humanize-duration.helper";

@Injectable({
	providedIn: 'root'
})
export class HumanizeDurationHelper {

	private readonly translateService = inject(TranslateService);
	private humanize = this.getHumanize();

	constructor() {
		this.translateService.onLangChange.subscribe(() => {
			this.humanize = this.getHumanize();
		});
	}

	private getHumanize() {
		const language = `short_${this.translateService.currentLang}`;
		return humanizeDuration.humanizer({
			language,
			languages: LanguagesHumanizeDurationHelper,
		});
	}

	public formatDuration(duration: string): string {
		return this.humanize(
			Duration.fromISOTime(duration).as('milliseconds')
		);
	}

	public formatISO(iso: string): string {
		return this.humanize(
			Duration.fromISO(iso).as('milliseconds')
		);
	}

	public fromSeconds(durationSeconds: number,): string {
		return this.humanize(
			durationSeconds * 1000,
		);
	}

}
