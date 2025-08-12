import {FormControl, FormGroup} from '@angular/forms';
import {StateEnum} from "@core/shared/enum/state.enum";

export interface IFilterForm {

	phrase: FormControl<string>;
	state: FormControl<StateEnum | null>;
	tags: FormControl<string[]>;

}

export class FilterForm extends FormGroup<IFilterForm> {
	constructor() {
		super({
			phrase: new FormControl(),
			state: new FormControl(StateEnum.active),
			tags: new FormControl([], {
				nonNullable: true,
			}),
		});
	}
}
