import {FormArray, FormControl, FormGroup} from "@angular/forms";
import {CustomerForm} from "@tenant/customer/presentation/form";
import {CustomerTypeEnum} from "@tenant/customer/domain/enum/customer-type.enum";
import {IAttendeeDto} from "@tenant/order/order/domain/interface/i-order-appointment-details.dto";


export interface IAttendeeDtoForm {
	object: FormControl<'AttendeeDto'>;
	_id: FormControl<string>;
	customer: CustomerForm;
	firstTime: FormControl<boolean>;
}

export class AttendeeDtoForm extends FormGroup<IAttendeeDtoForm> {
	constructor() {
		super({
			object: new FormControl('AttendeeDto', {
				nonNullable: true,
			}),
			_id: new FormControl(),
			customer: CustomerForm.create({
				customerType: CustomerTypeEnum.anonymous
			}),
			firstTime: new FormControl(false, {
				nonNullable: true,
			}),
		});
	}

}


export class AttendeesForm extends FormArray<AttendeeDtoForm> {

	constructor() {
		super([new AttendeeDtoForm()]);
	}

	public pushNewOne(initialValue?: Partial<IAttendeeDto>): AttendeeDtoForm {

		const control = new AttendeeDtoForm();

		if (initialValue) {

			control.patchValue(initialValue);

		}

		this.push(control);
		this.updateValueAndValidity();

		return control;

	}

}
