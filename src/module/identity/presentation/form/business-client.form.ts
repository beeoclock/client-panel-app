import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';


interface IBusinessClientForm {
  name: FormControl<string>;
  address: FormControl<string>;
  description: FormControl<string>;

  [key: string]: AbstractControl<any, any>;
}

export default class BusinessClientForm extends FormGroup<IBusinessClientForm> {
  constructor() {
    super({
      name: new FormControl(),
      address: new FormControl(),
      description: new FormControl(),
    });
    this.initValidators();
  }

  public initValidators(): void {
    this.controls.name.setValidators([Validators.required]);
    this.controls.address.setValidators([Validators.required]);
    this.controls.description.setValidators([Validators.required]);
  }
}
