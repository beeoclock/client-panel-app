import {FormControl} from '@angular/forms';
import {PaginationFilterFromGroup} from "@shared/pagination-filter-from-group";

export interface IFilterForm {

	phrase: FormControl<string>;

}

export class FilterForm extends PaginationFilterFromGroup<IFilterForm> {
	constructor() {
		super({
			phrase: new FormControl()
		});
	}
}
