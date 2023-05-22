import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from "@environment/environment";

interface ILoginForm {
  email: FormControl<string | null>;
  password: FormControl<string | null>;

  [key: string]: AbstractControl<any, any>;
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
    if (environment.firebase.emulator) {
      this.controls.email.setValue('text@example.com');
      this.controls.password.setValue('testPassword');
    }
  }
}
