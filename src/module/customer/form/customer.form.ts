import {AbstractControl, FormControl, FormGroup} from '@angular/forms';
import {is} from 'thiis';

export interface ICustomerForm {
  _id: FormControl<string | null>;

  firstName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  note: FormControl<string | null>;
  email: FormControl<string | null>;
  phone: FormControl<string | null>;

  [key: string]: AbstractControl<any, any>;
}

export class CustomerForm extends FormGroup<ICustomerForm> {

  constructor() {
    super({
      _id: new FormControl(null),

      firstName: new FormControl(null),
      lastName: new FormControl(null),
      note: new FormControl(null),
      email: new FormControl(null),
      phone: new FormControl(null),
    });
    this.addValidators((control: AbstractControl) => {
      if (is.object(control.value)) {
        if (Object.values(control.value).every(is.null)) {
          return {
            empty: true
          }
        }
      }
      return null;
    });
  }
}
