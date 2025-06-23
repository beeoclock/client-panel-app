import {ABaseEntity} from "@core/system/abstract/a.base-entity";
import {IOrder} from "../interface/i.order";
import {OrderStatusEnum} from "../enum/order.status.enum";
import {IOrderMetaDto} from "../interface/i.order-meta.dto";
import {IOrderProductDto} from "../interface/i.order-product.dto";
import {INotificationSettings} from "@tenant/order/order/domain/interface/i.notification-settings";
import {OrderServiceStatusEnum} from "@tenant/order/order-service/domain/enum/order-service.status.enum";
import {StateEnum} from "@core/shared/enum/state.enum";
import {IOrderService} from "@src/tenant/order/order-service/domain/interface/i.order-service.dto";
import {OrderFormValue} from "@tenant/order/order/presentation/form/order.form";

export const statusColorMap = {
	[OrderStatusEnum.draft]: {
		bg: 'bg-neutral-100',
		text: 'text-neutral-500',
	},
	[OrderStatusEnum.deleted]: {
		bg: 'bg-neutral-500',
		text: 'text-black',
	},
	[OrderStatusEnum.requested]: {
		bg: 'bg-blue-500',
		text: 'text-white',
	},
	[OrderStatusEnum.confirmed]: {
		bg: 'bg-green-500',
		text: 'text-white',
	},
	[OrderStatusEnum.inProgress]: {
		bg: 'bg-yellow-500',
		text: 'text-white',
	},
	[OrderStatusEnum.done]: {
		bg: 'bg-green-600',
		text: 'text-white',
	},
	[OrderStatusEnum.cancelled]: {
		bg: 'bg-red-500',
		text: 'text-white',
	},
	[OrderStatusEnum.rejected]: {
		bg: 'bg-red-600',
		text: 'text-white',
	},
	[OrderStatusEnum.waitingForPayment]: {
		bg: 'bg-orange-500',
		text: 'text-white',
	},
}

export class EOrder extends ABaseEntity<'OrderDto', IOrder.DTO, IOrder.EntityRaw> implements IOrder.EntityRaw {

	override object = 'OrderDto' as const;

	products!: IOrderProductDto[];
	services!: IOrderService.DTO[];
	status!: OrderStatusEnum;
	meta!: IOrderMetaDto;
	businessNote!: string;
	notificationSettings!: INotificationSettings;

	public get statusColor(): {
		bg: string;
		text: string;
	} {
		return statusColorMap[this.status];
	}

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
		const service = this.services.find(({_id}) => _id === serviceId);

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
	 *
	 * @param productId
	 * @param state
	 */
	public changeOrderedProductState(productId: string, state: StateEnum): void {
		const product = this.products.find(({_id}) => _id === productId);

		if (!product) {
			throw new Error(`Service with id ${productId} not found`);
		}

		product.state = state;
		product.stateHistory.push({
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

		if (this.services.length === 0 && this.products.length === 0) {
			return null;
		}

		const allServicesActive = this.services.every(({state}) => state === StateEnum.active);
		const allProductsActive = this.products.every(({state}) => state === StateEnum.active);
		if (allServicesActive && allProductsActive) {
			return StateEnum.active;
		}

		const allServicesDeleted = this.services.every(({state}) => state === StateEnum.active);
		const allProductsDeleted = this.products.every(({state}) => state === StateEnum.active);
		if (allServicesDeleted && allProductsDeleted) {
			return StateEnum.deleted;
		}

		const allServiceArchived = this.services.every(({state}) => state === StateEnum.archived);
		const allProductsArchived = this.products.every(({state}) => state === StateEnum.archived);
		if (allServiceArchived && allProductsArchived) {
			return StateEnum.archived;
		}

		const allServiceInactive = this.services.every(({state}) => state === StateEnum.inactive);
		const allProductsInactive = this.products.every(({state}) => state === StateEnum.inactive);
		if (allServiceInactive && allProductsInactive) {
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
			notificationSettings: data.notificationSettings,
			businessNote: data.businessNote,
			products: data.products,
			services: data.services,
			status: data.status,
			meta: data.meta,

			_id: data._id,
			state: data.state,
			object: data.object,
			_version: data._version,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
			stateHistory: data.stateHistory,
		}
	}

	/**
	 * Use it to create new entity, e.g. from API or form
	 * @param data
	 */
	public static fromFormValue(data: OrderFormValue): EOrder {
		// Set order.id into each service to orderId property and the same for products
		data.services.forEach((service) => {
			service.orderId = data._id;
		});
		// TODO: Uncomment when products are implemented
		// data.products.forEach((product) => {
		// 	product.orderId = data._id;
		// });
		return new EOrder(data);
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
