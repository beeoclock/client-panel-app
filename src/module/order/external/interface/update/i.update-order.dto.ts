import {IOrderProductDto} from "@order/external/interface/i.order-product.dto";
import {IOrderServiceDto} from "@order/external/interface/i.order-service.dto";

export interface IUpdateOrderDto {
	object: "UpdateOrderDto";
	_id: string;
	products: IOrderProductDto[],
	services: IOrderServiceDto[];
}

export type IListCreateOrderDto = IUpdateOrderDto[];
