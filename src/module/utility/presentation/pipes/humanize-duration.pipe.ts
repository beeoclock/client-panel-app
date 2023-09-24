import {inject, Pipe, PipeTransform} from "@angular/core";
import {HumanizeDurationAdapter} from "@utility/adapter/humanize-duration.adapter";

@Pipe({
	standalone: true,
	name: 'humanizeDuration'
})
export class HumanizeDurationPipe implements PipeTransform {

	private readonly humanizeDurationAdapter = inject(HumanizeDurationAdapter);

	/**
	 * Author: Ivan Karbashevskyi
	 * @param value
	 * @param type
	 */
	public transform(value: string | number, type: 'duration' | 'seconds' = 'seconds'): string {
		switch (type) {
			case 'duration':
				return this.humanizeDurationAdapter.formatDuration(value as string);
			case 'seconds':
				return this.humanizeDurationAdapter.fromSeconds(value as number);
		}
	}

}
