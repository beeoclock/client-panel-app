import {FormControl} from '@angular/forms';
import {ActiveEnum} from "@core/shared/enum";
import {PaginationFilterFromGroup} from "@shared/pagination-filter-from-group";

export interface IFilterForm {

	phrase: FormControl<string>;
	active: FormControl<ActiveEnum | null>;

}

export class FilterForm extends PaginationFilterFromGroup<IFilterForm> {
	constructor() {
		super({
			phrase: new FormControl(),
			active: new FormControl(),
		});
	}
}
