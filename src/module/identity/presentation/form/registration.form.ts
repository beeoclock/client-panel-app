import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from "@environment/environment";


interface IRegistrationForm {
  email: FormControl<string | null>;
  password: FormControl<string | null>;

  passwordConfirm: FormControl<string | null>;
  [key: string]: AbstractControl;
}

export default class RegistrationForm extends FormGroup<IRegistrationForm> {
  constructor() {
    super({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      passwordConfirm: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    });
    this.initValue();
  }

  private initValue(): void {
    if (environment.setDefaultValueToInputs) {
      this.controls.email.setValue('text@example.com');
      this.controls.password.setValue('testPassword');
      this.controls.passwordConfirm.setValue('testPassword');
    }
  }
}
