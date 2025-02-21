import {ABaseEntity} from "@core/system/abstract/a.base-entity";
import {IOrder} from "../interface/i.order";
import {OrderStatusEnum} from "../enum/order.status.enum";
import {IOrderMetaDto} from "../interface/i.order-meta.dto";
import {IOrderProductDto} from "../interface/i.order-product.dto";
import {IOrderServiceDto} from "../interface/i.order-service.dto";
import {INotificationSettings} from "@core/business-logic/order/interface/i.notification-settings";


export class EOrder extends ABaseEntity<'OrderDto', IOrder.DTO> implements IOrder.Entity {

	products!: IOrderProductDto[];
	services!: IOrderServiceDto[];
	status!: OrderStatusEnum;
	meta!: IOrderMetaDto;
	businessNote!: string;
	notificationSettings!: INotificationSettings;

	public override toDTO(): IOrder.DTO {
		return EOrder.toDTO(this);
	}

	public static toDTO(data: IOrder.Entity): IOrder.DTO {
		return {
			_id: data._id,
			businessNote: data.businessNote,
			createdAt: data.createdAt,
			meta: data.meta,
			object: data.object,
			products: data.products,
			services: data.services,
			state: data.state,
			stateHistory: data.stateHistory,
			status: data.status,
			updatedAt: data.updatedAt,
			notificationSettings: data.notificationSettings,
		}
	}

	/**
	 * Use it to create new entity, e.g. from API or form
	 * @param data
	 */
	public static create(data: IOrder.DTO): IOrder.Entity {
		return new EOrder(data);
	}

}

export default EOrder;
