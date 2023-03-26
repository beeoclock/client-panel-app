import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';


interface ILoginForm {
  displayName: FormControl<string | null>;
  email: FormControl<string | null>;
  password: FormControl<string | null>;

  // confirmPassword: FormControl<string | null>;
  [key: string]: AbstractControl<any, any>;
}

export default class LoginForm extends FormGroup<ILoginForm> {
  constructor() {
    super({
      displayName: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
      // confirmPassword: new FormControl(null, [Validators.required]),
    });
  }
}
