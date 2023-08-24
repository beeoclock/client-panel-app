import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";

export interface IChangeNameForm {

  name: FormControl<string>;

  [key: string]: AbstractControl<any, any>;
}

export class ChangeNameForm extends FormGroup<IChangeNameForm> {

  constructor() {
    super({
      name: new FormControl(),
    });

    this.initValidators();

  }

  private initValidators(): void {
    this.controls.name.setValidators(Validators.required);
  }

}
