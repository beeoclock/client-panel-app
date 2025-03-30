import {BaseEntityForm} from "@utility/base.form";
import {FormControl} from "@angular/forms";
import {IOrderProductDto} from "@core/business-logic/order/interface/i.order-product.dto";
import {OrderStatusEnum} from "@core/business-logic/order/enum/order.status.enum";
import {IOrderMetaDto} from "@core/business-logic/order/interface/i.order-meta.dto";
import {ServiceOrderFormArray} from "@tenant/order/presentation/form/service.order.form";

export interface IOrderForm {

	products: FormControl<IOrderProductDto[]>;
	services: ServiceOrderFormArray;
	status: FormControl<OrderStatusEnum>;
	meta: FormControl<IOrderMetaDto>;
	businessNote: FormControl<string>;

}

export class OrderForm extends BaseEntityForm<'OrderDto', IOrderForm> {

	constructor() {

		super('OrderDto', {

			products: new FormControl<IOrderProductDto[]>([], {
				nonNullable: true,
			}),

			services: new ServiceOrderFormArray(),

			status: new FormControl<OrderStatusEnum>(OrderStatusEnum.confirmed, {
				nonNullable: true,
			}),

			// meta: new FormControl(randomOrderMetaDto(), {
			//     nonNullable: true,
			// }),

			meta: new FormControl({
				object: 'OrderMetaDto',
				history: [],
			}, {
				nonNullable: true,
			}),

			businessNote: new FormControl('', {
				nonNullable: true,
			}),

		});

	}

}


