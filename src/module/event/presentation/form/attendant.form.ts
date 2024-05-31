import {FormArray, FormControl, FormGroup} from "@angular/forms";
import {IAttendee} from "@event/domain";
import {CustomerForm} from "@customer/presentation/form";
import {IsOptionalEnum, IsOrganizerEnum} from "@utility/domain/enum";
import {CustomerTypeEnum} from "@customer/domain/enum/customer-type.enum";


export interface IAttendantForm {
	_id: FormControl<string>;
	isOptional: FormControl<IsOptionalEnum>;
	isOrganizer: FormControl<IsOrganizerEnum>;
	customer: CustomerForm;
}

export class AttendantForm extends FormGroup<IAttendantForm> {
	constructor() {
		super({
			_id: new FormControl(),
			isOptional: new FormControl(IsOptionalEnum.NO, {
				nonNullable: true
			}),
			isOrganizer: new FormControl(IsOrganizerEnum.NO, {
				nonNullable: true
			}),
			customer: CustomerForm.create({
				customerType: CustomerTypeEnum.unknown
			})
		});
	}

}


export class AttendeesForm extends FormArray<AttendantForm> {

	constructor() {
		super([new AttendantForm()]);
	}

	public pushNewOne(initialValue?: IAttendee | undefined): AttendantForm {

		const control = new AttendantForm();

		if (initialValue) {

			control.patchValue(initialValue);

		}

		this.push(control);
		this.updateValueAndValidity();

		return control;

	}

}
