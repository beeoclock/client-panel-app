import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {IMember} from "@member/domain";

export interface IMemberForm {
  email: FormControl<string>;

  // TODO role or/and permission

  [key: string]: AbstractControl;
}

export class MemberForm extends FormGroup<IMemberForm> {

  constructor() {
    super({
      email: new FormControl(),
    });
    this.initValidators();
  }

  public initValidators(): void {
    this.controls.email.setValidators([Validators.email, Validators.required]);
  }

  public static create(initValue: IMember): MemberForm {

    const form = new MemberForm();

    form.patchValue(initValue);

    if ('email' in initValue) {
      form.controls.email.disable();
    }

    return form;

  }

}
