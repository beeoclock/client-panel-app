import {FormControl, FormGroup} from '@angular/forms';
import {ActiveEnum} from "@core/shared/enum";

export interface IFilterForm {

	phrase: FormControl<string>;
	active: FormControl<ActiveEnum | null>;

}

export class FilterForm extends FormGroup<IFilterForm> {
	constructor() {
		super({
			phrase: new FormControl(),
			active: new FormControl(),
		});
	}
}
