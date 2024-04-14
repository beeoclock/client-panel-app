import {FormArray, FormControl, FormGroup} from "@angular/forms";
import {IAttendee} from "@event/domain";
import {CustomerForm} from "@customer/presentation/form";
import {IsNewCustomerEnum, IsOptionalEnum, IsOrganizerEnum} from "@utility/domain/enum";


export interface IAttendantForm {
	_id: FormControl<string>;
	isOptional: FormControl<IsOptionalEnum>;
	isOrganizer: FormControl<IsOrganizerEnum>;
	isNewCustomer: FormControl<IsNewCustomerEnum>;
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
			isNewCustomer: new FormControl(IsNewCustomerEnum.YES, {
				nonNullable: true
			}),
			customer: new CustomerForm()
		});
	}

	public toggleIsNewCustomer(force: IsNewCustomerEnum | undefined = undefined): void {

		if (force !== undefined) {

			this.controls.isNewCustomer.patchValue(force);
			return;

		}

		if (this.controls.isNewCustomer.value === IsNewCustomerEnum.YES) {

			this.controls.isNewCustomer.patchValue(IsNewCustomerEnum.NO);

		} else {

			this.controls.isNewCustomer.patchValue(IsNewCustomerEnum.YES);

		}

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
