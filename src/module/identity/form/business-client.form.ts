import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';


interface IBusinessClientForm {
  name: FormControl<string | null>;
  address: FormControl<string | null>;
  slogan: FormControl<string | null>;

  [key: string]: AbstractControl<any, any>;
}

export default class BusinessClientForm extends FormGroup<IBusinessClientForm> {
  constructor() {
    super({
      name: new FormControl(null, [Validators.required]),
      address: new FormControl(null),
      slogan: new FormControl(null),
    });
  }
}
