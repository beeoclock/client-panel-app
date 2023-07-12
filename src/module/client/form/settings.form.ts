import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActiveEnum} from '@utility/domain/enum/active.enum';

export interface ISettingsForm {
  _id: FormControl<string>;
  id: FormControl<'settings'>;

  name: FormControl<string>;
  description: FormControl<string>;
  active: FormControl<ActiveEnum>;

  [key: string]: AbstractControl<any, any>;
}

export class SettingsForm extends FormGroup<ISettingsForm> {

  constructor() {
    super({
      _id: new FormControl(),
      id: new FormControl(),

      name: new FormControl(),
      description: new FormControl(),
      active: new FormControl(),
    });

    this.initValidators();
    this.initValue();

  }

  private initValue(): void {
    this.controls.id.setValue('settings');
    this.controls.active.setValue(ActiveEnum.NO);
  }

  private initValidators(): void {
    this.controls.name.setValidators([Validators.minLength(1), Validators.required]);
    this.controls.description.setValidators([Validators.maxLength(1000)]);
  }
}
