import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';

export interface IMemberForm {
  _id: FormControl<string>;
  firstName: FormControl<string>;
  secondName: FormControl<string>;
  lastName: FormControl<string>;
  email: FormControl<string>;
  phone: FormControl<string>;
  createdAt: FormControl<string>;
  updatedAt: FormControl<string>;

  [key: string]: AbstractControl<any, any>;
}

export class MemberForm extends FormGroup<IMemberForm> {

  constructor() {
    super({
      _id: new FormControl(),
      firstName: new FormControl(),
      secondName: new FormControl(),
      lastName: new FormControl(),
      email: new FormControl(),
      phone: new FormControl(),
      createdAt: new FormControl(),
      updatedAt: new FormControl(),
    });
    this.initValidators();
    this.initValue();
  }

  public initValidators(): void {
    this.controls.email.setValidators([Validators.email, Validators.required]);
  }

  public initValue(): void {
    this.controls.createdAt.patchValue(new Date().toISOString());
    this.controls.updatedAt.patchValue(new Date().toISOString());
  }

}
