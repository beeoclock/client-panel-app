import {BaseEntityForm} from "@utility/base.form";
import {FormArray, FormControl} from "@angular/forms";
import {IOrderServiceDto} from "@order/external/interface/i.order-service.dto";
import {IServiceDto} from "@order/external/interface/i.service.dto";
import {IOrderAppointmentDetailsDto} from "@order/external/interface/i-order-appointment-details.dto";
import {OrderServiceStatusEnum} from "@order/domain/enum/order-service.status.enum";
import {IMeta} from "@utility/domain";

export interface IServiceOrderForm {

	serviceSnapshot: FormControl<IServiceDto>;
	orderAppointmentDetails: FormControl<IOrderAppointmentDetailsDto>;
	customerNote: FormControl<string>;

	status: FormControl<OrderServiceStatusEnum>;
	meta: FormControl<IMeta>;

}

export class ServiceOrderForm extends BaseEntityForm<'OrderServiceDto', IServiceOrderForm> {

	constructor() {

		super('OrderServiceDto', {

			serviceSnapshot: new FormControl(),

			orderAppointmentDetails: new FormControl(),

			status: new FormControl(OrderServiceStatusEnum.accepted, {
				nonNullable: true,
			}),

			meta: new FormControl(),

			customerNote: new FormControl('', {
				nonNullable: true,
			}),

		});

	}

	public static create(initValue: Partial<IOrderServiceDto> = {}): ServiceOrderForm {

		const form = new ServiceOrderForm();

		initValue && form.patchValue(initValue);

		return form;

	}

}

export class ServiceOrderFormArray extends FormArray<ServiceOrderForm> {

	constructor() {
		super([]);
	}

	public pushNewOne(initialValue?: Partial<IOrderServiceDto> | undefined): ServiceOrderForm {

		const control = new ServiceOrderForm();

		if (initialValue) {

			control.patchValue(initialValue);

		}
		this.push(control);

		this.updateValueAndValidity();

		return control;

	}

}
