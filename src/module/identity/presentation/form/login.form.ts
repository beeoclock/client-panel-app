import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from "@environment/environment";

interface ILoginForm {
  email: FormControl<string | null>;
  password: FormControl<string | null>;

  [key: string]: AbstractControl;
}

export default class LoginForm extends FormGroup<ILoginForm> {
  constructor() {
    super({
      email: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required])
    });
    this.initValue();
  }

  private initValue(): void {
    if (environment.setDefaultValueToInputs) {
      this.controls.email.setValue('test.test@example.com');
      this.controls.password.setValue('testPassword');
    }
  }
}
