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
	 */
	public transform(value: string): string {
		return this.humanizeDurationAdapter.formatDuration(value);
	}

}
