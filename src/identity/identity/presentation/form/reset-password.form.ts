import {FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from "@environment/environment";

interface IResetPassword {
	email: FormControl<string>;
}

export default class ResetPasswordForm extends FormGroup<IResetPassword> {
	constructor() {
		super({
			email: new FormControl(),
		});
		this.initValue();
		this.initValidations();
	}

	private initValue(): void {
		if (environment.setDefaultValueToInputs) {
			this.controls.email.setValue('test.test@example.com');
		}
	}

	private initValidations(): void {
		this.controls.email.setValidators([Validators.email, Validators.required]);
	}
}
