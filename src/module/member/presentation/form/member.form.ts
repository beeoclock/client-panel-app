import {FormControl, FormGroup, Validators} from '@angular/forms';
import {RoleEnum} from "@core/shared/enum/role.enum";
import {RESPONSE_IMemberMedia} from "@src/core/business-logic/member/interface/i.member-media";
import {MemberProfileStatusEnum} from "@src/core/business-logic/member/enums/member-profile-status.enum";
import {BaseEntityForm} from "@utility/base.form";
import {IService} from "@core/business-logic/service/interface/i.service";
import {IMember} from "@core/business-logic/member/interface/i.member";

export interface IAssignments_ServiceForm {
	full: FormControl<boolean>;
	include: FormControl<{
		service: IService.DTO;
	}[]>;
}

export class Assignments_ServiceForm extends FormGroup<IAssignments_ServiceForm> {
	constructor() {
		super({
			full: new FormControl(true, {
				nonNullable: true,
			}),
			include: new FormControl([], {
				nonNullable: true,
			}),
		});
	}

	public get isFull(): boolean {
		return this.controls.full.value;
	}

	public get isNotFull(): boolean {
		return !this.isFull;
	}

	public get includeIsEmpty(): boolean {
		return !this.controls.include.value.length;
	}

	public get includeIsNotEmpty(): boolean {
		return !this.includeIsEmpty;
	}
}

export interface IAssignmentsForm {
	service: Assignments_ServiceForm;
}

export class AssignmentsForm extends FormGroup<IAssignmentsForm> {
	constructor() {
		super({
			service: new Assignments_ServiceForm(),
		});
	}
}

export interface IMemberForm {
	email: FormControl<string>;
	phone: FormControl<string>;
	avatar: FormControl<RESPONSE_IMemberMedia>;
	firstName: FormControl<string>;
	lastName: FormControl<string>;
	role: FormControl<RoleEnum>;
	profileStatus: FormControl<MemberProfileStatusEnum>;

	assignments: AssignmentsForm;

	// TODO role or/and permission
}

export class MemberForm extends BaseEntityForm<'MemberDto', IMemberForm> {

	constructor() {
		super('MemberDto', {
			email: new FormControl(),
			phone: new FormControl(),
			avatar: new FormControl(),
			firstName: new FormControl(),
			lastName: new FormControl(),
			profileStatus: new FormControl(MemberProfileStatusEnum.active, {
				nonNullable: true,
			}),
			role: new FormControl(RoleEnum.SPECIALIST, {
				nonNullable: true,
			}),
			assignments: new AssignmentsForm(),
		});
		this.initValidators();
	}

	public initValidators(): void {
		this.controls.email.setValidators([Validators.email, Validators.required]);
	}

	public static create(initValue: Partial<IMember.DTO> = {}): MemberForm {

		const form = new MemberForm();

		form.patchValue(initValue);

		if ('email' in initValue) {
			form.controls.email.disable();
		}

		return form;

	}

}

