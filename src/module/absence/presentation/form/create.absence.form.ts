import {AbsenceForm} from "@absence/presentation/form/absence.form";

export class CreateAbsenceForm extends AbsenceForm<'CreateAbsenceDto'> {

	constructor() {
		super('CreateAbsenceDto');
	}

}
