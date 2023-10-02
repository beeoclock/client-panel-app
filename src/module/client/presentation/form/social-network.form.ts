import {AbstractControl, FormArray, FormControl, FormGroup} from "@angular/forms";
import {SocialNetworkEnum} from "@utility/domain/enum/social-network.enum";
import {ISocialNetworkLink} from "@client/domain/interface/i.social-network-link";

export interface ISocialNetworkForm {

  object: FormControl<'SocialNetworkLink'>;
  link: FormControl<string>;
  type: FormControl<SocialNetworkEnum>;

  [key: string]: AbstractControl<any, any>;
}

export class SocialNetworkForm extends FormGroup<ISocialNetworkForm> {

  constructor() {
    super({
      object: new FormControl(),
      link: new FormControl(),
      type: new FormControl(),
    });

    this.initValue();

  }

  private initValue(): void {
    this.controls.object.setValue('SocialNetworkLink');
    this.controls.type.setValue(SocialNetworkEnum.INSTAGRAM);
  }

}

export class SocialNetworksForm extends FormArray<SocialNetworkForm> {
  constructor() {
    super([]);
  }

  public pushNewOne(initialValue?: ISocialNetworkLink): void {
    const control = new SocialNetworkForm();
    if (initialValue) {
      control.setValue(initialValue);
    }
    this.push(control);
  }

}
