import {FormControl, FormGroup} from '@angular/forms';
import {StateEnum} from "@core/shared/enum/state.enum";
import {OrderServiceStatusEnum} from "@tenant/order/order-service/domain/enum/order-service.status.enum";
import {IntervalTypeEnum} from "@tenant/analytic/domain/enum/interval.enum";
import {DateTime} from "luxon";
import {PaginationFilterFromGroup} from "@shared/pagination-filter-from-group";

export interface IFilterForm {

	phrase: FormControl<string>;
	state: FormControl<StateEnum[] | null>;
	members: FormControl<string[] | null>;
	services: FormControl<string[] | null>;
	statuses: FormControl<OrderServiceStatusEnum[] | null>;
	dateRange: FormGroup<{
		interval: FormControl<IntervalTypeEnum>;
		selectedDate: FormControl<string>;
	}>;

}

export class FilterForm extends PaginationFilterFromGroup<IFilterForm> {
	constructor() {
		super({

			phrase: new FormControl(),
			state: new FormControl([StateEnum.active]),
			members: new FormControl([]),
			services: new FormControl([]),
			statuses: new FormControl([]),
			dateRange: new FormGroup({
				interval: new FormControl<IntervalTypeEnum>(IntervalTypeEnum.day, {
					nonNullable: true
				}),
				selectedDate: new FormControl<string>(DateTime.now().toJSDate().toISOString(), {
					nonNullable: true
				}),
			})
		});
	}
}
