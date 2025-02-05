import {IBaseEntity} from "@utility/domain";
import IBaseItem from "@src/core/interface/i.base-item";
import {Tools} from "@utility/tools";
import {IOrderProductDto} from "@order/domain/interface/i.order-product.dto";
import {IOrderServiceDto} from "@order/domain/interface/i.order-service.dto";
import {OrderStatusEnum} from "@order/domain/enum/order.status.enum";
import {IOrderMetaDto} from "@order/domain/interface/i.order-meta.dto";

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
