import {IOrderProductDto} from "@order/external/interface/i.order-product.dto";
import {IOrderServiceDto} from "@order/external/interface/i.order-service.dto";

export interface ICreateOrderDto {
	object: "CreateOrderDto";
	_id: string;
	products: IOrderProductDto[],
	services: IOrderServiceDto[];
	payer: {
		_id: string;
		firstName: string;
		lastName: string;
		phone: string;
		email: string;
		note: string;
		active: number;
		customerType: string;
		createdAt: string;
		updatedAt: string;
	},
	paymentMethod: string;
}

export type IListCreateOrderDto = ICreateOrderDto[];
