import {IBaseEntity} from "@utility/domain";
import IBaseItem from "../../../shared/interface/i.base-item";
import {Tools} from "../../../shared/tools";
import {IOrderProductDto} from "./i.order-product.dto";
import {IOrderServiceDto} from "./i.order-service.dto";
import {OrderStatusEnum} from "../enum/order.status.enum";
import {IOrderMetaDto} from "./i.order-meta.dto";

export namespace IOrder {

	export interface DTO extends IBaseEntity<'OrderDto'> {

		products: IOrderProductDto[];
		services: IOrderServiceDto[];
		status: OrderStatusEnum;
		meta: IOrderMetaDto;
		businessNote: string;

	}

	export interface Entity extends IBaseItem<'OrderDto', DTO>, DTO {

		// TODO: add key in base entity to know if entity synced and when it was synced

		// TODO: getOrders
		// TODO: getFavoriteService
		// TODO: getFavoriteCustomer

	}

}

export const isOrder = Tools.createIs<IOrder.DTO>();
export const validOrder = Tools.createValidate<IOrder.DTO>();
export const randomOrder = Tools.createRandom<IOrder.DTO>();
