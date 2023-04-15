import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {SettingsFormAdapt} from '@company/network/adapt/settings.form.adapt';
import {inject} from '@angular/core';
import {ISettings} from '@company/infrastructure/settings.interface';
import {Notification} from '@utility/notification';
import BooleanStateModel from '@utility/boolean.state.model';

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

  private readonly settingsFormAdapt: SettingsFormAdapt = inject(SettingsFormAdapt);
  public readonly loadingData: BooleanStateModel = new BooleanStateModel(true);

  constructor() {
    super({
      name: new FormControl(null, [Validators.minLength(1), Validators.required]),
      description: new FormControl(null, [Validators.maxLength(1000)]),
      active: new FormControl(ActiveEnum.NO, []),
    });

    // Init data
    this.settingsFormAdapt.item().then((result) => {
      const data = result.data();
      if (data) {
        for (const key in data) {
          this.controls[key].setValue(data[key as keyof ISettings]);
        }
      }
      this.loadingData.switchOff();
    });

  }

  // Save data
  public save(): void {
    this.settingsFormAdapt.save(this.value).then(() => {
      Notification.push(new Notification('Success'));
    });
  }

}
