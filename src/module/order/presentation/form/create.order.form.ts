import {OrderForm} from "@order/presentation/form/order.form";

export class CreateOrderForm extends OrderForm<'CreateOrderDto'> {

	constructor() {
		super('CreateOrderDto');
	}

}
