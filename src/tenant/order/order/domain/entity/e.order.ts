import {ABaseEntity} from "@core/system/abstract/a.base-entity";
import {IOrder} from "../interface/i.order";
import {OrderStatusEnum} from "../enum/order.status.enum";
import {IOrderMetaDto} from "../interface/i.order-meta.dto";
import {IOrderProductDto} from "../interface/i.order-product.dto";
import {IOrderServiceDto} from "../interface/i.order-service.dto";
import {INotificationSettings} from "@tenant/order/order/domain/interface/i.notification-settings";
import {OrderServiceStatusEnum} from "@tenant/order/order/domain/enum/order-service.status.enum";
import {StateEnum} from "@core/shared/enum/state.enum";


export class EOrder extends ABaseEntity<'OrderDto', IOrder.DTO, IOrder.EntityRaw> implements IOrder.EntityRaw {

	override object = 'OrderDto' as const;

	products!: IOrderProductDto[];
	services!: IOrderServiceDto[];
	status!: OrderStatusEnum;
	meta!: IOrderMetaDto;
	businessNote!: string;
	notificationSettings!: INotificationSettings;

	/**
	 * Change the status of the order.
	 * @param status
	 */
	public changeOrderStatus(status: OrderStatusEnum): void {

		this.status = status;

		const orderedServiceStatusCase: { [key in keyof typeof OrderStatusEnum]?: OrderServiceStatusEnum } = {
			[OrderStatusEnum.confirmed]: OrderServiceStatusEnum.accepted,
			[OrderStatusEnum.rejected]: OrderServiceStatusEnum.rejected,
		};

		const newOrderedServiceStatus = orderedServiceStatusCase[status];

		if (newOrderedServiceStatus) {

			this.services.forEach((service) => {
				if (service.status === OrderServiceStatusEnum.requested) {
					service.status = newOrderedServiceStatus;
				}
			});

		}

	}

	/**
	 *
	 * @param state
	 */
	public override changeState(state: StateEnum): void {
		this.state = state;
		this.stateHistory.push({
			state,
			setAt: new Date().toISOString(),
		});
		this.services.forEach((service) => {
			service.state = state;
		});
	}

	/**
	 * Change the status of a service in the order.
	 * @param serviceId
	 * @param status
	 */
	public changeOrderedServiceStatus(serviceId: string, status: OrderServiceStatusEnum): void {

		const service = this.services.find((service) => service._id === serviceId);

		if (!service) {

			throw new Error(`Service with id ${serviceId} not found`);

		}

		service.status = status;

		// Update the order status
		const newOrderStatus = this.determineOrderStatus();

		if (newOrderStatus) {
			this.changeOrderStatus(newOrderStatus);
		}

	}

	/**
	 *
	 * @param serviceId
	 * @param state
	 */
	public changeOrderedServiceState(serviceId: string, state: StateEnum): void {
		const service = this.services.find((service) => service._id === serviceId);

		if (!service) {
			throw new Error(`Service with id ${serviceId} not found`);
		}

		service.state = state;
		service.stateHistory.push({
			state,
			setAt: new Date().toISOString(),
		});

		// Update the order state
		const newOrderState = this.determineOrderState();

		if (newOrderState) {
			this.changeState(newOrderState);
		}
	}

	/**
	 * Determine the overall status of an order based on the status of its services.
	 * @returns The new order status, or null if no change is needed.
	 */
	public determineOrderStatus(): OrderStatusEnum | null {
		const allServicesDone = this.services.every(service => service.status === OrderServiceStatusEnum.done);
		if (allServicesDone) {
			return OrderStatusEnum.done;
		}

		const allServicesCancelled = this.services.every(service => service.status === OrderServiceStatusEnum.cancelled);
		if (allServicesCancelled) {
			return OrderStatusEnum.cancelled;
		}

		const anyServiceInProgress = this.services.some(service => service.status === OrderServiceStatusEnum.inProgress);
		if (anyServiceInProgress) {
			return OrderStatusEnum.inProgress;
		}

		const allServicesDeleted = this.services.every(service => service.status === OrderServiceStatusEnum.deleted);
		if (allServicesDeleted) {
			return OrderStatusEnum.deleted;
		}

		// No change to the order status
		return null;
	}

	public determineOrderState(): StateEnum | null {
		const allServicesActive = this.services.every(service => service.state === StateEnum.active);
		if (allServicesActive) {
			return StateEnum.active;
		}

		const allServicesDeleted = this.services.every(service => service.state === StateEnum.deleted);
		if (allServicesDeleted) {
			return StateEnum.deleted;
		}

		const allServiceArchived = this.services.every(service => service.state === StateEnum.archived);
		if (allServiceArchived) {
			return StateEnum.archived;
		}

		const allServiceInactive = this.services.some(service => service.state === StateEnum.inactive);
		if (allServiceInactive) {
			return StateEnum.inactive;
		}

		// No change to the order status
		return null;
	}

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
