import {IBaseDTO, IBaseEntityRaw} from "@shared/domain";
import {Tools} from "@core/shared/tools";
import {IOrderProductDto} from "./i.order-product.dto";
import {IOrderService} from "@tenant/order/order-service/domain/interface/i.order-service.dto";
import {OrderStatusEnum} from "../enum/order.status.enum";
import {IOrderMetaDto} from "./i.order-meta.dto";
import {INotificationSettings} from "@tenant/order/order/domain/interface/i.notification-settings";


export namespace IOrder {

	export interface DTO extends IBaseDTO<'OrderDto'> {

		products: IOrderProductDto[];
		services: IOrderService.DTO[];
		status: OrderStatusEnum;
		meta: IOrderMetaDto;
		businessNote: string;
		notificationSettings: INotificationSettings;

	}

	export type EntityRaw = IBaseEntityRaw<'OrderDto'> & DTO & {

		// TODO: add key in base entity to know if entity synced and when it was synced

		// TODO: getOrders
		// TODO: getFavoriteService
		// TODO: getFavoriteCustomer

	};

}

export const isOrder = Tools.createIs<IOrder.DTO>();
export const validOrder = Tools.createValidate<IOrder.DTO>();
export const randomOrder = Tools.createRandom<IOrder.DTO>();
