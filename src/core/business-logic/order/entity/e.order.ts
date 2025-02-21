import {ABaseEntity} from "@core/system/abstract/a.base-entity";
import {IOrder} from "../interface/i.order";
import {OrderStatusEnum} from "../enum/order.status.enum";
import {IOrderMetaDto} from "../interface/i.order-meta.dto";
import {IOrderProductDto} from "../interface/i.order-product.dto";
import {IOrderServiceDto} from "../interface/i.order-service.dto";
import {INotificationSettings} from "@core/business-logic/order/interface/i.notification-settings";


export class EOrder extends ABaseEntity<'OrderDto', IOrder.DTO, IOrder.EntityRaw> implements IOrder.EntityRaw {

	override object = 'OrderDto' as const;

	products!: IOrderProductDto[];
	services!: IOrderServiceDto[];
	status!: OrderStatusEnum;
	meta!: IOrderMetaDto;
	businessNote!: string;
	notificationSettings!: INotificationSettings;

	public override toDTO(): IOrder.DTO {
		return EOrder.toDTO(this);
	}

	public static toDTO(data: IOrder.EntityRaw): IOrder.DTO {
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
	public static fromDTO(data: IOrder.DTO): EOrder {
		return new EOrder(data);
	}

	/**
	 * Use it to create entity from raw data, e.g. from database
	 * @param data
	 */
	public static fromRaw(data: IOrder.EntityRaw): EOrder {
		return new EOrder(data);
	}

}

export default EOrder;
