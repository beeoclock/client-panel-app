import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';

export enum ActiveEnum {
  NO,
  YES
}

export interface ISettingsForm {
  name: FormControl<string | null>;
  description: FormControl<string | null>;
  active: FormControl<ActiveEnum | null>;

  [key: string]: AbstractControl<any, any>;
}

export class SettingsForm extends FormGroup<ISettingsForm> {
  constructor() {
    super({
      name: new FormControl(null, [Validators.minLength(1), Validators.required]),
      description: new FormControl(null, [Validators.maxLength(1000)]),
      active: new FormControl(ActiveEnum.NO, []),
    });
  }
}
