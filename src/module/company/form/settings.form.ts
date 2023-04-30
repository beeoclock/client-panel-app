import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {inject} from '@angular/core';
import {Notification} from '@utility/notification';
import BooleanStateModel from '@utility/boolean.state.model';
import * as Company from '@company/domain';
import {SettingsFormRepository} from '@company/repository/settings.form.repository';
import {ActiveEnum} from '@utility/domain/enum/active.enum';

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
          this.controls[key].setValue(data[key as keyof Company.Interface.ISettings]);
        }
      }
      this.loadingData.switchOff();
    });

  }

  // Save data
  public save(): void {
    this.settingsFormRepository.save(this.value).then(() => {
      Notification.push({
        message: 'Success'
      });
    });
  }

}
