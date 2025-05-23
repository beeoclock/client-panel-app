import {FormControl} from '@angular/forms';
import {StateEnum} from "@core/shared/enum/state.enum";
import {PaginationFilterFromGroup} from "@shared/pagination-filter-from-group";

export interface IFilterForm {

	phrase: FormControl<string>;
	state: FormControl<StateEnum[] | null>;

}

export class FilterForm extends PaginationFilterFromGroup<IFilterForm> {
	constructor() {
		super({
			phrase: new FormControl(),
			state: new FormControl([StateEnum.active])
		});
	}
}
