import {FormControl, FormGroup} from '@angular/forms';
import {StateEnum} from "@utility/domain/enum/state.enum";

export interface IFilterForm {

	phrase: FormControl<string>;
	state: FormControl<StateEnum | null>;

}

export class FilterForm extends FormGroup<IFilterForm> {
	constructor() {
		super({
			phrase: new FormControl(),
			state: new FormControl(),
		});
	}
}
