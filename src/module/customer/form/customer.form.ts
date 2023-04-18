import {AbstractControl, FormControl, FormGroup} from '@angular/forms';
import {inject} from '@angular/core';
import {CustomerFormRepository} from '@customer/repository/customer.form.repository';
import {is} from 'thiis';
import {Notification} from '@utility/notification';

export interface ICustomerForm {
  id: FormControl<string | null>;

  firstName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  note: FormControl<string | null>;
  email: FormControl<string | null>;
  phone: FormControl<string | null>;

  [key: string]: AbstractControl<any, any>;
}

export class CustomerForm extends FormGroup<ICustomerForm> {

  private readonly customerFormAdapt: CustomerFormRepository = inject(CustomerFormRepository);

  constructor() {
    super({
      id: new FormControl(null),

      firstName: new FormControl(null),
      lastName: new FormControl(null),
      note: new FormControl(null),
      email: new FormControl(null),
      phone: new FormControl(null),
    });
    this.addValidators((control: AbstractControl) => {
      console.log(control);
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

  public async save(): Promise<void> {
    this.markAllAsTouched();
    if (this.valid) {
      const {id, ...value} = this.value;
      await this.customerFormAdapt.save(value, id);
      Notification.push(new Notification('success'));
    }
  }
}
