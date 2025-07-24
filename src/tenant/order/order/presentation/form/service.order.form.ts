import {BaseEntityForm} from "@shared/base.form";
import {FormArray, FormControl} from "@angular/forms";
import {IOrderServiceDto} from "@tenant/order/order/domain/interface/i.order-service.dto";
import {IOrderAppointmentDetailsDto} from "@tenant/order/order/domain/interface/i-order-appointment-details.dto";
import {OrderServiceStatusEnum} from "@tenant/order/order-service/domain/enum/order-service.status.enum";
import {IMeta} from "@shared/domain";
import {IService} from "@tenant/service/domain/interface/i.service";

export interface IServiceOrderForm {

	serviceSnapshot: FormControl<IService.DTO>;
	orderAppointmentDetails: FormControl<IOrderAppointmentDetailsDto>;
	customerNote: FormControl<string>;
	orderId: FormControl<string>;

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
			orderId: new FormControl(),

		});

	}

	public static create(initValue: Partial<IOrderServiceDto> = {}): ServiceOrderForm {

		const form = new ServiceOrderForm();

		if (initValue) form.patchValue(initValue);

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

	public static create(initialValue: IOrderServiceDto[] = []): ServiceOrderFormArray {
		const formArray = new ServiceOrderFormArray();
		initialValue.forEach((serviceOrderDto) => formArray.push(ServiceOrderForm.create(serviceOrderDto)));
		return formArray;
	}

}
