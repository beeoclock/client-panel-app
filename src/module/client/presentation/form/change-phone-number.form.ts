import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";

export interface IChangePhoneNumberForm {

  phoneNumber: FormControl<string>;

  [key: string]: AbstractControl;
}

export class ChangePhoneNumberForm extends FormGroup<IChangePhoneNumberForm> {

  constructor() {
    super({
      phoneNumber: new FormControl(),
    });

    this.initValidators();

  }

  private initValidators(): void {
    this.controls.phoneNumber.setValidators(Validators.required);
  }

}
