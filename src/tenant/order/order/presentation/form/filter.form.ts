import {FormControl} from '@angular/forms';
import {ActiveEnum} from "@core/shared/enum";
import {PaginationFilterFromGroup} from "@shared/pagination-filter-from-group";
import {OrderStatusEnum} from "@tenant/order/order/domain/enum/order.status.enum";

export interface IFilterForm {

	phrase: FormControl<string>;
	active: FormControl<ActiveEnum | null>;
	orderStatusControl: FormControl<OrderStatusEnum[]>;

}

export class FilterForm extends PaginationFilterFromGroup<IFilterForm> {
	constructor() {
		super({
			phrase: new FormControl(),
			active: new FormControl(),
			orderStatusControl: new FormControl<OrderStatusEnum[]>([
				OrderStatusEnum.confirmed,
				OrderStatusEnum.done,
				OrderStatusEnum.cancelled,
			], {
				nonNullable: true,
			}),
		});
	}
}
