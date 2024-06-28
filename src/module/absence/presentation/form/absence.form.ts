import {FormControl} from '@angular/forms';
import {ActiveEnum} from "@utility/domain/enum";
import {BaseEntityForm} from "@utility/base.form";
import {AbsenceTypeEnum} from "@absence/domain/enums/absence.type.enum";
import {DateTime} from "luxon";
import {RIMember} from "@member/domain";

export interface IAbsenceForm {

	start: FormControl<string>;
	end: FormControl<string>;
	timeZone: FormControl<string>;
	note: FormControl<string>;
	active: FormControl<ActiveEnum>;
	type: FormControl<AbsenceTypeEnum>;
	entireBusiness: FormControl<boolean>;
	members: FormControl<RIMember[]>;

}

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

			active: new FormControl(ActiveEnum.YES, {
				nonNullable: true,
			}),

			entireBusiness: new FormControl(false, {
				nonNullable: true,
			}),
		});

	}

}
