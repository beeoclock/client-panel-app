import {ABaseItem} from "../../../system/abstract/a.base-item";
import {IOrder} from "../interface/i.order";
import {OrderStatusEnum} from "../enum/order.status.enum";
import {IOrderMetaDto} from "../interface/i.order-meta.dto";
import {IOrderProductDto} from "../interface/i.order-product.dto";
import {IOrderServiceDto} from "../interface/i.order-service.dto";


export class EOrder extends ABaseItem<'OrderDto', IOrder.DTO> implements IOrder.Entity {

    products!: IOrderProductDto[];
    services!: IOrderServiceDto[];
    status!: OrderStatusEnum;
    meta!: IOrderMetaDto;
    businessNote!: string;


	public override toDTO(): IOrder.DTO {
		return EOrder.toDTO(this);
	}

	public static toDTO(data: IOrder.Entity): IOrder.DTO {
		const {id, ...rest} = data;
		return rest;
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
