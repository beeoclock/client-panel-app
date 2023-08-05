import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {is} from 'thiis';

export interface ICustomerForm {
  _id: FormControl<string>;

  firstName: FormControl<string>;
  lastName: FormControl<string>;
  note: FormControl<string>;
  email: FormControl<string>;
  phone: FormControl<string>;

  [key: string]: AbstractControl<any, any>;
}

export class CustomerForm extends FormGroup<ICustomerForm> {

  constructor() {
    super({
      _id: new FormControl(),

      firstName: new FormControl(),
      lastName: new FormControl(),
      note: new FormControl(),
      email: new FormControl(),
      phone: new FormControl(),
    });
    this.initValidation();
  }

  public isEmpty(): boolean {
    return Object.values(this.controls).every((control: AbstractControl) => {
      return control.value === null;
    });
  }

  public isNotEmpty(): boolean {
    return !this.isEmpty();
  }

  public initValidation(): void {

    this.controls.email.setValidators([Validators.email]);

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
