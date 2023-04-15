import {AbstractControl, FormControl, FormGroup} from '@angular/forms';
import {inject} from '@angular/core';
import {CustomerFormAdapt} from '@customer/network/adapt/customer.form.adapt';

export interface ICustomerForm {
  firstName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  note: FormControl<string | null>;
  email: FormControl<string | null>;
  phone: FormControl<string | null>;

  [key: string]: AbstractControl<any, any>;
}

export class CustomerForm extends FormGroup<ICustomerForm> {

  private readonly customerFormAdapt: CustomerFormAdapt = inject(CustomerFormAdapt);

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
  public save(): void {
    console.log(this.value);
    this.customerFormAdapt.save(this.value);
  }
}
