import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActiveEnum} from "@utility/domain/enum";
import {noWhitespaceValidator} from "@utility/validation/whitespace";
import {emailOrPhoneRequiredValidator} from "@customer/presentation/form/validation/email-or-phone.validation";

export interface ICustomerForm {
	_id: FormControl<string>;

	firstName: FormControl<string>;
	lastName: FormControl<string>;
	note: FormControl<string>;
	email: FormControl<string>;
	phone: FormControl<string>;

	active: FormControl<ActiveEnum>;

	[key: string]: AbstractControl;
}

export class CustomerForm extends FormGroup<ICustomerForm> {

	constructor() {
		super({
			_id: new FormControl(),

			firstName: new FormControl(),
			lastName: new FormControl(),
			note: new FormControl(),
			email: new FormControl(),
			phone: new FormControl(),

			active: new FormControl(),
		});
		this.initValue();
		this.initValidation();
	}

	public isNew(): boolean {
		return !this.controls._id.value;
	}

	public isNotNew(): boolean {
		return !this.isNew();
	}

	public isEmpty(): boolean {
		return Object.values(this.controls).every((control: AbstractControl) => {
			return control.value === null;
		});
	}

	public isNotEmpty(): boolean {
		return !this.isEmpty();
	}

	private initValue(): void {
		this.controls.active.setValue(ActiveEnum.YES);
	}

	public initValidation(): void {
		this.controls.email.setValidators([Validators.email, noWhitespaceValidator()]);
		this.controls.phone.setValidators([noWhitespaceValidator()]);

		this.setValidators([emailOrPhoneRequiredValidator()]);
	}
}
