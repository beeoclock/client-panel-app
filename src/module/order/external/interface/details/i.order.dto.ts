import {OrderStatus} from "@module/order/domain/enum/order.status.enum";
import {IOrderProductDto} from "../i.order-product.dto";
import {IOrderServiceDto} from "@order/external/interface/i.order-service.dto";
import {IOrderMetaDto} from "@order/external/interface/i.order-meta.dto";

export interface IOrderDto {
	object: "OrderDto";
	_id: string;
	products: IOrderProductDto[];
	services: IOrderServiceDto[];
	status: OrderStatus;
	meta: IOrderMetaDto;
}

export type IListOrderDto = IOrderDto[];
