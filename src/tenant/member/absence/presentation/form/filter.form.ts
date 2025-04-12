import {FormControl, FormGroup} from '@angular/forms';
import {StateEnum} from "@core/shared/enum/state.enum";
import {IntervalTypeEnum} from "@tenant/analytic/domain/enum/interval.enum";
import {DateTime} from "luxon";

export interface IFilterForm {

	phrase: FormControl<string>;
	state: FormControl<StateEnum | null>;
	members: FormControl<string[] | null>;
	dateRange: FormGroup<{
		interval: FormControl<IntervalTypeEnum>;
		selectedDate: FormControl<string>;
	}>;

}

export class FilterForm extends FormGroup<IFilterForm> {
	constructor() {
		super({
			phrase: new FormControl(),
			state: new FormControl(StateEnum.active),
			members: new FormControl([]),
			dateRange: new FormGroup({
				interval: new FormControl<IntervalTypeEnum>(IntervalTypeEnum.month, {
					nonNullable: true
				}),
				selectedDate: new FormControl<string>(DateTime.now().toJSDate().toISOString(), {
					nonNullable: true
				}),
			})
		});
	}
}
