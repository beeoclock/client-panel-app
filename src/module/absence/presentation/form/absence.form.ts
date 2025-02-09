import {FormControl} from '@angular/forms';
import {BaseEntityForm} from "@utility/base.form";
import {AbsenceTypeEnum} from "@absence/domain/enums/absence.type.enum";
import {DateTime} from "luxon";
import {IAbsence} from "@absence/domain/interface/i.absence";

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

	}

	public static create(initialValues: Partial<IAbsence.DTO> = {}): AbsenceForm {
		const form = new AbsenceForm();
		form.patchValue(initialValues);
		return form;
	}

}
