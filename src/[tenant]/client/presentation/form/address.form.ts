import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {IAddress} from "@core/business-logic/business-profile/interface/i.address";
import {CountryCodeEnum} from "@core/shared/enum/country-code.enum";

export interface IAddressForm {

	object: FormControl<'Address'>;
	city: FormControl<string>;
	zipCode: FormControl<string>;
	streetAddressLineOne: FormControl<string>;
	streetAddressLineTwo: FormControl<string>;
	customLink: FormControl<string | null>;
	country: FormControl<CountryCodeEnum>;
}

export class AddressForm extends FormGroup<IAddressForm> {

	constructor(config: {
		initValidation: boolean;
	} = {
		initValidation: true,
	}) {
		super({
			object: new FormControl('Address', {
				nonNullable: true,
			}),
			country: new FormControl(),
			city: new FormControl(),
			zipCode: new FormControl(),
			streetAddressLineOne: new FormControl(),
			streetAddressLineTwo: new FormControl(),
			customLink: new FormControl(),
		});

		const {initValidation} = config;

		initValidation && this.initValidators();

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
		super([]);
	}

	public pushNewOne(initialValue?: IAddress, config?: {
		initValidation: boolean;
	}): void {
		const control = new AddressForm(config);
		if (initialValue) {
			control.patchValue(initialValue);
		}
		this.push(control);
	}

}
