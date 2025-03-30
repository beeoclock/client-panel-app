import {inject, Pipe, PipeTransform} from '@angular/core';
import {DurationVersionHtmlHelper} from '@utility/helper/duration-version.html.helper';
import {IService} from "@tenant/service/domain/interface/i.service";

@Pipe({
	name: 'durationPrice',
	standalone: true,
})
export default class DurationPricePipe implements PipeTransform {

	private readonly durationVersionHtmlHelper = inject(DurationVersionHtmlHelper);

	transform(item: IService.DTO, type: 'duration' | 'price'): string {
		if (type === 'duration') {
			return this.durationVersionHtmlHelper.getDurationValue(item);
		} else if (type === 'price') {
			return this.durationVersionHtmlHelper.getPriceValue(item);
		}
		return '';
	}
}
