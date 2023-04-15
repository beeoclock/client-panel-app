import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {inject} from '@angular/core';
import {Notification} from '@utility/notification';
import BooleanStateModel from '@utility/boolean.state.model';
import {ISettings} from '@company/interface/settings.interface';
import {SettingsFormRepository} from '@company/repository/settings.form.repository';

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

  private readonly settingsFormRepository: SettingsFormRepository = inject(SettingsFormRepository);
  public readonly loadingData: BooleanStateModel = new BooleanStateModel(true);

  constructor() {
    super({
      name: new FormControl(null, [Validators.minLength(1), Validators.required]),
      description: new FormControl(null, [Validators.maxLength(1000)]),
      active: new FormControl(ActiveEnum.NO, []),
    });

    // Init data
    this.settingsFormRepository.item().then((result) => {
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
    this.settingsFormRepository.save(this.value).then(() => {
      Notification.push(new Notification('Success'));
    });
  }

}
