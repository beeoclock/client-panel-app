import {inject, Injectable} from "@angular/core";
import {Action, State, StateContext, Store} from "@ngxs/store";
import {baseDefaults, IBaseState} from "@shared/state/base/base.state";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {TranslateService} from "@ngx-translate/core";
import {NGXLogger} from "ngx-logger";
import {ModalController} from "@ionic/angular/standalone";
import {environment} from "@environment/environment";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {Router} from "@angular/router";
import {SecondRouterOutletService} from "@src/second.router-outlet.service";
import {
	OrderServiceDataActions
} from "@tenant/order/order-service/infrastructure/state/data/order-service.data.actions";
import {OrderStatusEnum} from "@tenant/order/order/domain/enum/order.status.enum";
import EOrder from "@tenant/order/order/domain/entity/e.order";
import {OrderActions} from "@tenant/order/order/infrastructure/state/order/order.actions";
import EOrderService from "@tenant/order/order-service/domain/entity/e.order-service";
import {firstValueFrom} from "rxjs";

export type IOrderState = IBaseState<EOrder>;

const defaults = baseDefaults<EOrder>({
	filters: {
		statuses: [
			OrderStatusEnum.confirmed,
			OrderStatusEnum.done,
			OrderStatusEnum.cancelled,
		]
	},
	orderBy: OrderByEnum.CREATED_AT,
	orderDir: OrderDirEnum.DESC,
	pageSize: environment.config.pagination.pageSize
});

@State<IOrderState>({
	name: 'orderServiceData',
	defaults,
})
@Injectable()
export class OrderServiceDataState {

	private readonly sharedUow = inject(SharedUow);

	private readonly store = inject(Store);
	private readonly modalController = inject(ModalController);

	private readonly translateService = inject(TranslateService);
	private readonly ngxLogger = inject(NGXLogger);
	private readonly router = inject(Router);
	private readonly secondRouterOutletService = inject(SecondRouterOutletService);

	@Action(OrderServiceDataActions.ChangeStatus)
	public async changeStatusActionHandler(ctx: StateContext<IOrderState>, action: OrderServiceDataActions.ChangeStatus): Promise<void> {
		// const foundOrder = await this.sharedUow.orderService.repository.findByIdAsync(action.payload.id);
		// if (!foundOrder) {
		// 	return;
		// }
		// const orderEntity = EOrderService.fromDTO(foundOrder);
		// orderEntity.status = action.payload.status;
		// await this.addNotificationSettingsToOrderEntity(orderEntity);
		// await this.sharedUow.orderService.repository.updateAsync(orderEntity);

	}

	@Action(OrderServiceDataActions.UpdateItem)
	public async updateItem(ctx: StateContext<IOrderState>, {payload: item}: OrderServiceDataActions.UpdateItem): Promise<void> {
		const foundItem = await this.sharedUow.orderService.repository.findByIdAsync(item._id);
		const foundOrder = await this.sharedUow.order.repository.findByIdAsync(item.orderId);
		if (!foundOrder) {
			this.ngxLogger.error('OrderServiceDataState.updateItem: Order not found', item.orderId);
			return;
		}

		if (!foundItem) {
			this.ngxLogger.error('OrderServiceDataState.updateItem: Order Service not found', item._id);
			return;
		}

		const orderServiceEntity = EOrderService.fromRaw({
			...foundItem,
			...item,
		});

		foundOrder.services = foundOrder.services.map((service) => {
			if (service._id === orderServiceEntity._id) {
				return orderServiceEntity;
			}
			return service;
		});
		const orderEntity = EOrder.fromRaw(foundOrder);

		const actionUpdateOrder = new OrderActions.UpdateItem(orderEntity)
		const actionUpdateOrder$ = ctx.dispatch(actionUpdateOrder);
		await firstValueFrom(actionUpdateOrder$);

	}

	@Action(OrderServiceDataActions.SetState)
	public async setState(ctx: StateContext<IOrderState>, {item, state}: OrderServiceDataActions.SetState) {
		// const foundItems = await this.sharedUow.orderService.repository.findByIdAsync(item._id);
		// if (foundItems) {
		// 	const entity = EOrderService.fromRaw(foundItems);
		// 	entity.changeState(state);
		// 	await this.sharedUow.orderService.repository.updateAsync(entity);
		// 	await this.updateOpenedDetailsAction(ctx, {payload: entity});
		// 	ctx.dispatch(new OrderServiceDataActions.GetList());
		// }
	}

	@Action(OrderServiceDataActions.OrderedServiceStatus)
	public async orderedServiceStatus(ctx: StateContext<IOrderState>, {
		orderedServiceId,
		orderId,
		status
	}: OrderServiceDataActions.OrderedServiceStatus) {
		// const foundItems = await this.sharedUow.orderService.repository.findByIdAsync(orderId);
		// if (foundItems) {
		// 	const entity = EOrderService.fromRaw(foundItems);
		// 	entity.changeOrderedServiceStatus(orderedServiceId, status);
		// 	await this.sharedUow.orderService.repository.updateAsync(entity);
		// 	await this.updateOpenedDetailsAction(ctx, {payload: entity});
		// 	ctx.dispatch(new OrderServiceDataActions.GetList());
		// }
	}

	@Action(OrderServiceDataActions.OrderedServiceState)
	public async orderedServiceState(ctx: StateContext<IOrderState>, {
		orderedServiceId,
		orderId,
		state
	}: OrderActions.OrderedServiceState) {
		// const foundItems = await this.sharedUow.orderService.repository.findByIdAsync(orderId);
		// if (foundItems) {
		// 	this.ngxLogger.debug('OrderState.orderedServiceState', foundItems);
		// 	const entity = EOrderService.fromRaw(foundItems);
		// 	entity.changeOrderedServiceState(orderedServiceId, state);
		// 	await this.sharedUow.orderService.repository.updateAsync(entity);
		// 	await this.updateOpenedDetailsAction(ctx, {payload: entity});
		// 	ctx.dispatch(new OrderServiceDataActions.GetList());
		// }
	}


}
