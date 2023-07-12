import {AbstractControl, FormControl, FormGroup} from '@angular/forms';
import {ActiveEnum} from "@utility/domain/enum";

export interface IFilterForm {

  search: FormControl<string>;
  active: FormControl<ActiveEnum>;

  [key: string]: AbstractControl<any, any>;

}

export class FilterForm extends FormGroup<IFilterForm> {
  constructor() {
    super({
      search: new FormControl(),
      active: new FormControl(),
    });
    this.initValue();
  }

  public initValue(): void {
    this.controls.active.setValue(ActiveEnum.YES);
  }
}
