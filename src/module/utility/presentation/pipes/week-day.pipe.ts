import {Pipe, PipeTransform} from "@angular/core";
import {WEEK_DAYS_NAME} from "@core/shared/enum";

@Pipe({
	standalone: true,
	name: 'weekDay'
})
export class WeekDayPipe implements PipeTransform {

	/**
	 * Author: Ivan Karbashevskyi
	 * @param value
	 */
	public transform(value: undefined | number): string {
		if (value) {
			return WEEK_DAYS_NAME[value];
		}
		return 'unknown';
	}

}
