import {FormControl, FormGroup} from '@angular/forms';
import {StateEnum} from "@core/shared/enum/state.enum";

export interface IFilterForm {

	phrase: FormControl<string>;
	state: FormControl<StateEnum | null>;
	members: FormControl<string[] | null>;

}

export class FilterForm extends FormGroup<IFilterForm> {
	constructor() {
		super({
			phrase: new FormControl(),
			state: new FormControl(StateEnum.active),
			members: new FormControl([]),
		});
	}
}
