import {FormControl, FormGroup} from '@angular/forms';
import {StateEnum} from "@core/shared/enum/state.enum";
import {OrderServiceStatusEnum} from "@tenant/order-service/domain/enum/order-service.status.enum";

export interface IFilterForm {

	phrase: FormControl<string>;
	state: FormControl<StateEnum | null>;
	members: FormControl<string[] | null>;
	services: FormControl<string[] | null>;
	statuses: FormControl<OrderServiceStatusEnum[] | null>;

}

export class FilterForm extends FormGroup<IFilterForm> {
	constructor() {
		super({
			phrase: new FormControl(),
			state: new FormControl(),
			members: new FormControl([]),
			services: new FormControl([]),
			statuses: new FormControl([]),
		});
	}
}
