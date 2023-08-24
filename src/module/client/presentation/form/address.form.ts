import {AbstractControl, FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {CountryEnum} from "@utility/domain/enum/country.enum";
import {IAddress} from "@client/domain/interface/i.address";

export interface IAddressForm {

  object: FormControl<'Address'>;
  city: FormControl<string>;
  zipCode: FormControl<string>;
  streetAddressLineOne: FormControl<string>;
  streetAddressLineTwo: FormControl<string>;
  country: FormControl<CountryEnum>;

  [key: string]: AbstractControl<any, any>;
}

export class AddressForm extends FormGroup<IAddressForm> {

  constructor() {
    super({
      object: new FormControl(),
      country: new FormControl(),
      city: new FormControl(),
      zipCode: new FormControl(),
      streetAddressLineOne: new FormControl(),
      streetAddressLineTwo: new FormControl(),
    });

    this.initValue();
    this.initValidators();

  }

  private initValue(): void {
    this.controls.object.setValue('Address');
  }

  private initValidators(): void {
    this.controls.country.setValidators(Validators.required);
    this.controls.city.setValidators(Validators.required);
    this.controls.zipCode.setValidators(Validators.required);
    this.controls.streetAddressLineOne.setValidators(Validators.required);
  }

}

export class AddressesForm extends FormArray<AddressForm> {
  constructor() {
    super([new AddressForm()]);
  }

  public remove(index: number): void {
    this.controls.splice(index, 1);
  }

  public pushNewOne(initialValue?: IAddress): void {
    const control = new AddressForm();
    if (initialValue) {
      control.setValue(initialValue);
    }
    this.controls.push(control);
  }

}
