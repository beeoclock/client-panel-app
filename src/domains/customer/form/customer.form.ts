import {AbstractControl, FormControl, FormGroup} from '@angular/forms';

export interface ICustomerForm {
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
      firstName: new FormControl(null),
      lastName: new FormControl(null),
      note: new FormControl(null),
      email: new FormControl(null),
      phone: new FormControl(null),
    });
  }

  // TODO add validator: if form is empty then "note" control is required!
}
