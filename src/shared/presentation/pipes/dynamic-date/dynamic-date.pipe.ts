import {inject, Pipe, PipeTransform} from "@angular/core";
import {DynamicDateHelper, Formats} from "@shared/presentation/pipes/dynamic-date/dynamic-date.helper";

@Pipe({
	name: 'dynamicDate',
	pure: true,
	standalone: true
})
export class DynamicDatePipe implements PipeTransform {

	private readonly dynamicDateHelper = inject(DynamicDateHelper);

	public transform(value: string, format: Formats = 'short') {
		return this.dynamicDateHelper.transform(value, format);
	}

}
