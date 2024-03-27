import {FormControl, FormGroup, Validators} from '@angular/forms';
import {RIMember} from "@member/domain";
import {RoleEnum} from "@utility/domain/enum/role.enum";

export interface IMemberForm {
	_id: FormControl<string>;
	email: FormControl<string>;
	firstName: FormControl<string>;
	lastName: FormControl<string>;
	role: FormControl<RoleEnum>;

	// TODO role or/and permission
}

export class MemberForm extends FormGroup<IMemberForm> {

	constructor() {
		super({
			_id: new FormControl(),
			email: new FormControl(),
			firstName: new FormControl(),
			lastName: new FormControl(),
			role: new FormControl(RoleEnum.SPECIALIST, {
				nonNullable: true,
			}),
		});
		this.initValidators();
	}

	public initValidators(): void {
		this.controls.email.setValidators([Validators.email, Validators.required]);
	}

	public static create(initValue: RIMember): MemberForm {

		const form = new MemberForm();

		form.patchValue(initValue);

		if ('email' in initValue) {
			form.controls.email.disable();
		}

		return form;

	}

}
