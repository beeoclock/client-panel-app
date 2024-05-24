import {OrderStatus} from "@module/order/domain/enum/order.status.enum";
import {IOrderProductDto} from "../i.order-product.dto";
import {IOrderServiceDto} from "@order/external/interface/i.order-service.dto";
import {IOrderMetaDto} from "@order/external/interface/i.order-meta.dto";
import {IBaseEntity} from "@utility/domain";

export interface IOrderDto extends IBaseEntity<'OrderDto'> {
	products: IOrderProductDto[];
	services: IOrderServiceDto[];
	status: OrderStatus;
	meta: IOrderMetaDto;
}

export type IListOrderDto = IOrderDto[];
