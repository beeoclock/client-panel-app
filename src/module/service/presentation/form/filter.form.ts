import {AbstractControl, FormControl, FormGroup} from '@angular/forms';
import {ActiveEnum} from "@utility/domain/enum";

export interface IFilterForm {

	phrase: FormControl<string>;
	active: FormControl<ActiveEnum | null>;

  [key: string]: AbstractControl<any, any>;

}

export class FilterForm extends FormGroup<IFilterForm> {
  constructor() {
    super({
			phrase: new FormControl(),
			active: new FormControl()
    });
		this.initValue();
	}

	public initValue(): void {
		this.controls.active.setValue(ActiveEnum.YES);
	}
}
