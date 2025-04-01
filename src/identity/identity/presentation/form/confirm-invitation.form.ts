import {FormControl, FormGroup, Validators} from '@angular/forms';

interface IConfirmInvitationForm {
	email: FormControl<string>;
	businessName: FormControl<string>;
	tenantId: FormControl<string>;
	invitationCode: FormControl<string>;
	password: FormControl<string>;
}

export class ConfirmInvitationForm extends FormGroup<IConfirmInvitationForm> {
	constructor() {
		super({
			email: new FormControl(),
			businessName: new FormControl(),
			tenantId: new FormControl(),
			invitationCode: new FormControl(),

			password: new FormControl(),
		});
		this.initValidation();
	}

	private initValidation(): void {
		this.controls.tenantId.setValidators([Validators.required]);
		this.controls.invitationCode.setValidators([Validators.required]);
		this.controls.password.setValidators([Validators.required, Validators.minLength(6)]);
	}

}
