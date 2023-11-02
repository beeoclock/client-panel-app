import {inject, Pipe, PipeTransform} from "@angular/core";
import {HumanizeDurationHelper} from "@utility/helper/humanize/humanize-duration.helper";

@Pipe({
	standalone: true,
	name: 'humanizeDuration'
})
export class HumanizeDurationPipe implements PipeTransform {

	private readonly humanizeDurationHelper = inject(HumanizeDurationHelper);

	/**
	 * Author: Ivan Karbashevskyi
	 * @param value
	 * @param type
	 */
	public transform(value: string | number, type: 'duration' | 'iso' | 'seconds' = 'seconds'): string {
		switch (type) {
			case 'iso':
				return this.humanizeDurationHelper.formatISO(value as string);
			case 'duration':
				return this.humanizeDurationHelper.formatDuration(value as string);
			case 'seconds':
				return this.humanizeDurationHelper.fromSeconds(value as number);
		}
	}

}
