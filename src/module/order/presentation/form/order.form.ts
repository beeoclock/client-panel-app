import {BaseEntityForm} from "@utility/base.form";

export interface IOrderForm {


}

export class OrderForm<OBJECT_NAME extends 'CreateOrderDto' | 'UpdateOrderDto' = 'CreateOrderDto' | 'UpdateOrderDto'> extends BaseEntityForm<OBJECT_NAME, IOrderForm> {

	constructor(
		objectName: OBJECT_NAME,
	) {
		super(objectName, {

		});

	}

}
