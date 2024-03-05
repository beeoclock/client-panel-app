import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {CountryEnum} from "@utility/domain/enum/country.enum";
import {IAddress} from "@client/domain/interface/i.address";

export interface IAddressForm {

	object: FormControl<'Address'>;
	city: FormControl<string>;
	zipCode: FormControl<string>;
	streetAddressLineOne: FormControl<string>;
	streetAddressLineTwo: FormControl<string>;
	country: FormControl<CountryEnum>;
}

export class AddressForm extends FormGroup<IAddressForm> {

	constructor(config: {
		initValidation: boolean;
		initValue: boolean;
	} = {
		initValidation: true,
		initValue: true,
	}) {
		super({
			object: new FormControl(),
			country: new FormControl(),
			city: new FormControl(),
			zipCode: new FormControl(),
			streetAddressLineOne: new FormControl(),
			streetAddressLineTwo: new FormControl(),
		});

		const {initValidation, initValue} = config;

		initValue && this.initValue();
		initValidation && this.initValidators();

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

	public pushNewOne(initialValue?: IAddress): void {
		const control = new AddressForm();
		if (initialValue) {
			control.setValue(initialValue);
		}
		this.push(control);
	}

}
