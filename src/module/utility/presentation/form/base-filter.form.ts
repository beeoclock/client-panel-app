import { FormControl, FormGroup } from '@angular/forms';
import { ActiveEnum } from '@utility/domain/enum';

export interface IBaseFilterForm {
	phrase: FormControl<string>;
	active: FormControl<ActiveEnum | null>;
}

export class BaseFilterForm extends FormGroup<IBaseFilterForm> {
	constructor() {
		super({
			phrase: new FormControl(),
			active: new FormControl(),
		});
	}
}
