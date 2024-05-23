import {AbsenceForm} from "@absence/presentation/form/absence.form";

export class UpdateAbsenceForm extends AbsenceForm<'UpdateAbsenceDto'> {

	constructor() {
		super('UpdateAbsenceDto');
	}

}
