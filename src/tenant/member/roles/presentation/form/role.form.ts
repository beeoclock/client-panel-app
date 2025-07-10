import {FormControl, FormGroup, Validators} from '@angular/forms';
import {BaseEntityForm} from "@shared/base.form";
import {IRole} from "@tenant/member/roles/domain";

export interface IRoleForm {
	name: FormControl<string>;
	isOwner: FormControl<boolean>;
	permissions: FormControl<IRole.Permission[]>;
}

export class RoleForm extends BaseEntityForm<'RoleDto', IRoleForm> {

	constructor() {
		super('RoleDto', {
			name: new FormControl('', {
				nonNullable: true,
			}),
			isOwner: new FormControl(false, {
				nonNullable: true,
			}),
			permissions: new FormControl([], {
				nonNullable: true,
			}),
		});
		this.initValidators();
	}

	public initValidators(): void {
		this.controls.name.setValidators([Validators.required, Validators.minLength(2)]);
	}

	public static create(initValue: Partial<IRole.DTO> = {}): RoleForm {

		const form = new RoleForm();

		form.patchValue(initValue);

		return form;

	}

} 