import {FormControl, FormGroup} from '@angular/forms';

export interface IFilterForm {

	search: FormControl<string>;

}

export class FilterForm extends FormGroup<IFilterForm> {
	constructor() {
		super({
			search: new FormControl()
		});
	}
}
