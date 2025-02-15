import {OrderStatusEnum} from "../../enum/order.status.enum";
import {IOrderProductDto} from "../i.order-product.dto";
import {IOrderServiceDto} from "../i.order-service.dto";
import {IOrderMetaDto} from "../i.order-meta.dto";
import {IBaseEntity} from "@utility/domain";

export interface IOrderDto extends IBaseEntity<'OrderDto'> {
	products: IOrderProductDto[];
	services: IOrderServiceDto[];
	status: OrderStatusEnum;
	meta: IOrderMetaDto;
	businessNote: string;
}

export type IListOrderDto = IOrderDto[];
