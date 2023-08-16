import {AbstractControl, FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {CellCountryPrefixEnum} from "@utility/domain/enum/cell-country-prefix.enum";
import {IContact} from "@client/domain/interface/i.contact";

export interface IContactForm {

  object: FormControl<'Contact'>;
  countryCode: FormControl<CellCountryPrefixEnum>;
  phoneNumber: FormControl<string>;

  [key: string]: AbstractControl<any, any>;
}

export class ContactForm extends FormGroup<IContactForm> {

  constructor() {
    super({
      object: new FormControl(),
      countryCode: new FormControl(),
      phoneNumber: new FormControl(),
    });

    this.initValue();
    this.initValidators();

  }

  private initValue(): void {
    this.controls.object.setValue('Contact');
    this.controls.countryCode.setValue(CellCountryPrefixEnum.Ukraine);
  }

  private initValidators(): void {
    this.controls.countryCode.setValidators(Validators.required);
    this.controls.phoneNumber.setValidators(Validators.required);
  }

}

export class ContactsForm extends FormArray<ContactForm> {
  constructor() {
    super([]);
  }

  public remove(index: number): void {
    this.controls.splice(index, 1);
  }

  public pushNewOne(initialValue?: IContact): void {
    const control = new ContactForm();
    if (initialValue) {
      control.setValue(initialValue);
    }
    this.controls.push(control);
  }

}
