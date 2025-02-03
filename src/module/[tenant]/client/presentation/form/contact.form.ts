import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {CellCountryPrefixEnum} from "@utility/domain/enum/cell-country-prefix.enum";
import {IContact} from "@client/domain/interface/i.contact";

export interface IContactForm {

	object: FormControl<'Contact'>;
	countryCode: FormControl<CellCountryPrefixEnum>;
	phoneNumber: FormControl<string>;
}

export class ContactForm extends FormGroup<IContactForm> {

	constructor() {
		super({
			object: new FormControl('Contact', {
				nonNullable: true,
			}),
			countryCode: new FormControl(),
			phoneNumber: new FormControl(),
		});

		this.initValue();
		this.initValidators();

	}

	private initValue(): void {
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

	public pushNewOne(initialValue?: IContact): void {
		const control = new ContactForm();
		if (initialValue) {
			control.patchValue(initialValue);
		}
		this.push(control);
	}

}
