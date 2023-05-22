import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from "@environment/environment";


interface IRegistrationForm {
  displayName: FormControl<string | null>;
  email: FormControl<string | null>;
  password: FormControl<string | null>;

  passwordConfirm: FormControl<string | null>;

  [key: string]: AbstractControl<any, any>;
}

export default class RegistrationForm extends FormGroup<IRegistrationForm> {
  constructor() {
    super({
      displayName: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
      passwordConfirm: new FormControl(null, [Validators.required]),
    });
    this.initValue();
  }

  private initValue(): void {
    if (environment.firebase.emulator) {
      this.controls.displayName.setValue('Default Name Of New User');
      this.controls.email.setValue('text@example.com');
      this.controls.password.setValue('testPassword');
      this.controls.passwordConfirm.setValue('testPassword');
    }
  }
}
