import {IBaseDTO, IBaseEntity} from "@utility/domain";
import {Tools} from "@core/shared/tools";
import {IOrderProductDto} from "./i.order-product.dto";
import {IOrderServiceDto} from "./i.order-service.dto";
import {OrderStatusEnum} from "../enum/order.status.enum";
import {IOrderMetaDto} from "./i.order-meta.dto";
import {INotificationSettings} from "@core/business-logic/order/interface/i.notification-settings";

export namespace IOrder {

	export interface DTO extends IBaseDTO<'OrderDto'> {

		products: IOrderProductDto[];
		services: IOrderServiceDto[];
		status: OrderStatusEnum;
		meta: IOrderMetaDto;
		businessNote: string;
		notificationSettings: INotificationSettings;

	}

	export type Entity = IBaseEntity<'OrderDto', DTO> & DTO & {

		// TODO: add key in base entity to know if entity synced and when it was synced

		// TODO: getOrders
		// TODO: getFavoriteService
		// TODO: getFavoriteCustomer

	};

}

export const isOrder = Tools.createIs<IOrder.DTO>();
export const validOrder = Tools.createValidate<IOrder.DTO>();
export const randomOrder = Tools.createRandom<IOrder.DTO>();
