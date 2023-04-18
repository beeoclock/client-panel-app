import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';

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
  }
}
