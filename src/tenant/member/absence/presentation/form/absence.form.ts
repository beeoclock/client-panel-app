import {AbstractControl, FormControl, ValidationErrors} from '@angular/forms';
import {BaseEntityForm} from "@shared/base.form";
import {AbsenceTypeEnum} from "@tenant/member/absence/domain/enums/absence.type.enum";
import {DateTime} from "luxon";
import {IAbsence} from "@tenant/member/absence/domain/interface/i.absence";
import {is} from "@core/shared/checker";

export type IAbsenceForm = {
	[K in keyof IAbsence.DTO]: FormControl<IAbsence.DTO[K]>;
};

export class AbsenceForm extends BaseEntityForm<'AbsenceDto', IAbsenceForm> {

	constructor() {
		super('AbsenceDto', {

			// Start date now
			start: new FormControl(DateTime.local().toUTC().toISO(), {
				nonNullable: true,
			}),

			// End date 15 minutes from now
			end: new FormControl(DateTime.local().plus({minutes: 15}).toUTC().toISO(), {
				nonNullable: true,
			}),

			// Current time zone name
			timeZone: new FormControl(DateTime.local().zoneName, {
				nonNullable: true,
			}),

			note: new FormControl('', {
				nonNullable: true,
			}),

			members: new FormControl([], {
				nonNullable: true,
			}),

			type: new FormControl(AbsenceTypeEnum.break, {
				nonNullable: true,
			}),

			entireBusiness: new FormControl(false, {
				nonNullable: true,
			}),
		});

		this.initValidation();

	}

	public initValidation() {
		this.atLeastOneMemberSelectedOrEntireBusiness();
		this.startBeforeEnd();
	}

	private startBeforeEnd() {
		this.addValidators((control: AbstractControl): ValidationErrors | null => {
			const value = control.getRawValue();
			if (is.object(value)) {
				const {start, end} = value as IAbsence.DTO;
				if (DateTime.fromISO(start) >= DateTime.fromISO(end)) {
					return {startBeforeEnd: true};
				}
			}
			return null;
		});
	}

	private atLeastOneMemberSelectedOrEntireBusiness() {
		this.addValidators((control: AbstractControl): ValidationErrors | null => {

			const value = control.getRawValue();
			if (is.object(value)) {
				const {members, entireBusiness} = value as IAbsence.DTO;
				if (!entireBusiness && members.length === 0) {
					return {atLeastOneMemberSelectedOrEntireBusiness: true};
				}
			}
			return null;
		});
	}

	public static create(initialValues: Partial<IAbsence.DTO> = {}): AbsenceForm {
		const form = new AbsenceForm();
		form.patchValue(initialValues);
		return form;
	}

}
