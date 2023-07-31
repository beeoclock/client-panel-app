import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActiveEnum} from '@utility/domain/enum/active.enum';
import {file2base64} from "@utility/domain/file2base64";
import {SocialNetworksForm} from "@client/form/social-network.form";
import {extractFile} from "@utility/domain/extract-file";


export interface ISettingsForm {
  _id: FormControl<string>;
  id: FormControl<'settings'>;

  logo: FormControl<string>;
  name: FormControl<string>;
  slogan: FormControl<string>;
  address: FormControl<string>;
  description: FormControl<string>;
  active: FormControl<ActiveEnum>;

  socialNetworkLinks: SocialNetworksForm;

  [key: string]: AbstractControl<any, any>;
}

export class SettingsForm extends FormGroup<ISettingsForm> {

  constructor() {
    super({
      _id: new FormControl(),
      id: new FormControl(),

      logo: new FormControl(),
      name: new FormControl(),
      slogan: new FormControl(),
      address: new FormControl(),
      startingPrice: new FormControl(),
      description: new FormControl(),
      active: new FormControl(),
      socialNetworkLinks: new SocialNetworksForm(),
    });

    this.initValidators();
    this.initHandles();
    this.initValue();

  }

  private initHandles(): void {
    this.controls.active.valueChanges.subscribe((value) => {
      if (typeof value === 'boolean') {
        this.controls.active.patchValue(+value, {
          emitEvent: false
        });
      }
    })
  }

  private initValue(): void {
    this.controls.id.setValue('settings');
    this.controls.active.setValue(ActiveEnum.NO);
  }

  private initValidators(): void {
    this.controls.name.setValidators([Validators.minLength(1), Validators.required]);
    this.controls.description.setValidators([Validators.maxLength(1000)]);
  }

  public async setLogo(target: HTMLInputElement): Promise<void> {
    const base64 = await file2base64(extractFile(target));
    this.controls.logo.patchValue(base64);
  }
}
