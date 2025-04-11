import {IProductDto} from "./i.product.dto";

export interface IOrderProductDto {
	object: "OrderProductDto";
	_id: string;
	quantity: number;
	orderServiceId: string;
	productSnapshot: IProductDto;
	meta: {
		object: string;
		history: {
			object: string;
			issuerRole: string;
			issuerId: string;
			reason: string;
			value: string;
			createdAt: string;
		}[]
	}
}
