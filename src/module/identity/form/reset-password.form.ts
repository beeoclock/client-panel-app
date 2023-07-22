import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from "@environment/environment";

interface IResetPassword {
  email: FormControl<string>;

  [key: string]: AbstractControl<any, any>;
}

export default class ResetPasswordForm extends FormGroup<IResetPassword> {
  constructor() {
    super({
      email: new FormControl(),
    });
    this.initValue();
    this.initValidations();
  }

  private initValue(): void {
    if (environment.firebase.emulator) {
      this.controls.email.setValue('test.test@example.com');
    }
  }

  private initValidations(): void {
    this.controls.email.setValidators([Validators.email, Validators.required]);
  }
}
