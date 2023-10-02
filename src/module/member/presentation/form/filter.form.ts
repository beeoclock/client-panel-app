import {AbstractControl, FormControl, FormGroup} from '@angular/forms';

export interface IFilterForm {

  search: FormControl<string>;

  [key: string]: AbstractControl;

}

export class FilterForm extends FormGroup<IFilterForm> {
  constructor() {
    super({
      search: new FormControl()
    });
  }
}
