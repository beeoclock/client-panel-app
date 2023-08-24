import {AbstractControl, FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
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
    this.initValidators();

  }

  private initValue(): void {
    this.controls.object.setValue('SocialNetworkLink');
    this.controls.type.setValue(SocialNetworkEnum.INSTAGRAM);
  }

  private initValidators(): void {
    this.controls.link.setValidators(Validators.required);
    this.controls.type.setValidators(Validators.required);
  }

}

export class SocialNetworksForm extends FormArray<SocialNetworkForm> {
  constructor() {
    super([]);
  }

  public remove(index: number): void {
    this.controls.splice(index, 1);
  }

  public pushNewOne(initialValue?: ISocialNetworkLink): void {
    const control = new SocialNetworkForm();
    if (initialValue) {
      control.setValue(initialValue);
    }
    this.controls.push(control);
  }

}
