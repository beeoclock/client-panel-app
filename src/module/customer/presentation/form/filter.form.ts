import {AbstractControl, FormControl, FormGroup} from '@angular/forms';
import {ActiveEnum} from "@utility/domain/enum";

export interface IFilterForm {

	phrase: FormControl<string>;
	active: FormControl<ActiveEnum | null>;

	[key: string]: AbstractControl;

}

export class FilterForm extends FormGroup<IFilterForm> {
	constructor() {
		super({
			phrase: new FormControl(),
			active: new FormControl(),
		});
	}
}
