import {BaseEntityForm} from "@utility/base.form";
import {FormControl} from "@angular/forms";
import {IOrderProductDto} from "@tenant/order/domain/interface/i.order-product.dto";
import {OrderStatusEnum} from "@tenant/order/domain/enum/order.status.enum";
import {IOrderMetaDto} from "@tenant/order/domain/interface/i.order-meta.dto";
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


