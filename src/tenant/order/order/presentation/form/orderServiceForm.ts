import {BaseEntityForm} from "@shared/base.form";
import {FormArray, FormControl} from "@angular/forms";
import {IOrderService} from "@tenant/order/order-service/domain/interface/i.order-service.dto";
import {IOrderAppointmentDetailsDto} from "@tenant/order/order-service/domain/interface/i-order-appointment-details.dto";
import {OrderServiceStatusEnum} from "@tenant/order/order-service/domain/enum/order-service.status.enum";
import {IMeta} from "@shared/domain";
import {IService} from "@tenant/service/domain/interface/i.service";

export interface IOrderServiceForm {

    serviceSnapshot: FormControl<IService.DTO>;
    orderAppointmentDetails: FormControl<IOrderAppointmentDetailsDto>;
	customerNote: FormControl<string>;
	orderId: FormControl<string>;

	status: FormControl<OrderServiceStatusEnum>;
	meta: FormControl<IMeta>;

}

export class OrderServiceForm extends BaseEntityForm<'OrderServiceDto', IOrderServiceForm> {

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

    public static create(initValue: Partial<IOrderService.DTO> = {}): OrderServiceForm {

		const form = new OrderServiceForm();

		if (initValue) form.patchValue(initValue);

		return form;

	}

}

export class OrderServiceFormArray extends FormArray<OrderServiceForm> {

	constructor() {
		super([]);
	}

    public pushNewOne(initialValue?: Partial<IOrderService.DTO> | undefined): OrderServiceForm {

		const control = new OrderServiceForm();

		if (initialValue) {

			control.patchValue(initialValue);

		}
		this.push(control);

		this.updateValueAndValidity();

		return control;

	}

    public static create(initialValue: IOrderService.DTO[] = []): OrderServiceFormArray {
		const formArray = new OrderServiceFormArray();
        initialValue.forEach((serviceOrderDto) => formArray.push(OrderServiceForm.create(serviceOrderDto)));
		return formArray;
	}

}
