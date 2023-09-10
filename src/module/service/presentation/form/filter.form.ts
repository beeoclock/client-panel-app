import {AbstractControl, FormControl, FormGroup} from '@angular/forms';

export interface IFilterForm {

	phrase: FormControl<string>;

  [key: string]: AbstractControl<any, any>;

}

export class FilterForm extends FormGroup<IFilterForm> {
  constructor() {
    super({
			phrase: new FormControl()
    });
  }
}
