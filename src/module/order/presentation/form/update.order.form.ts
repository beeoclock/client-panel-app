import {OrderForm} from "@order/presentation/form/order.form";

export class UpdateOrderForm extends OrderForm<'UpdateOrderDto'> {

	constructor() {
		super('UpdateOrderDto');
	}

}
