import {BaseEntityForm} from "@shared/base.form";
import {FormControl} from "@angular/forms";
import {OrderStatusEnum} from "@tenant/order/order/domain/enum/order.status.enum";
import {IOrderMetaDto} from "@tenant/order/order/domain/interface/i.order-meta.dto";
import {OrderServiceFormArray} from "@tenant/order/order/presentation/form/orderServiceForm";
import {OrderProductFormArray} from "@tenant/order/order/presentation/form/product.order.form";

export interface IOrderForm {

	products: OrderProductFormArray;
	services: OrderServiceFormArray;
	status: FormControl<OrderStatusEnum>;
	meta: FormControl<IOrderMetaDto>;
	businessNote: FormControl<string>;

}

export class OrderForm extends BaseEntityForm<'OrderDto', IOrderForm> {

	constructor() {

		super('OrderDto', {

			products: new OrderProductFormArray(),
			services: new OrderServiceFormArray(),

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


