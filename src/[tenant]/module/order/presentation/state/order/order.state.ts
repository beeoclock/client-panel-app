import {inject, Injectable, reflectComponentType} from "@angular/core";
import {Action, Selector, State, StateContext, Store} from "@ngxs/store";
import {baseDefaults, BaseState, IBaseState} from "@utility/state/base/base.state";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {TranslateService} from "@ngx-translate/core";
import {OrderActions} from "@order/presentation/state/order/order.actions";
import {WhacAMoleProvider} from "@utility/presentation/whac-a-mole/whac-a-mole.provider";
import {NGXLogger} from "ngx-logger";
import EOrder from "@core/business-logic/order/entity/e.order";
import {firstValueFrom} from "rxjs";
import {AppActions} from "@utility/state/app/app.actions";
import {TableState} from "@utility/domain/table.state";
import {getMaxPage} from "@utility/domain/max-page";
import {StateEnum} from "@core/shared/enum/state.enum";
import {CustomerTypeEnum} from "@core/business-logic/customer/enum/customer-type.enum";
import ECustomer from "@core/business-logic/customer/entity/e.customer";
import {OrderStatusEnum} from "@core/business-logic/order/enum/order.status.enum";
import {BusinessProfileState} from "@businessProfile/infrastructure/state/business-profile/business-profile.state";
import {SendNotificationConditionEnum} from "@core/shared/enum/send-notification-condition.enum";
import {OverlayEventDetail} from "@ionic/core/dist/types/utils/overlays-interface";
import {ModalController} from "@ionic/angular/standalone";
import {
	NotificationSettingsComponent
} from "@order/presentation/component/notification-settings/notification-settings.component";
import {INotificationSettings} from "@core/business-logic/order/interface/i.notification-settings";
import {environment} from "@environment/environment";
import {SharedUow} from "@core/shared/uow/shared.uow";

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
	name: 'order',
	defaults,
})
@Injectable()
export class OrderState {

	private readonly sharedUow = inject(SharedUow);

	private readonly store = inject(Store);
	private readonly modalController = inject(ModalController);

	private readonly whacAMaleProvider = inject(WhacAMoleProvider);
	private readonly translateService = inject(TranslateService);
	private readonly ngxLogger = inject(NGXLogger);

	@Action(OrderActions.Init)
	public async init(ctx: StateContext<IOrderState>): Promise<void> {
		ctx.setState(structuredClone(defaults));
	}

	@Action(OrderActions.UpdateFilters)
	public updateFilters(ctx: StateContext<IOrderState>, action: OrderActions.UpdateFilters) {
		BaseState.updateFilters(ctx, action);
	}

	@Action(OrderActions.UpdateTableState)
	public updateTableState(ctx: StateContext<IOrderState>, action: OrderActions.UpdateTableState) {
		BaseState.updateTableState<EOrder>(ctx, action);
	}

	// Application layer

	@Action(OrderActions.CloseDetails)
	public async closeDetailsAction() {

		const {OrderDetailsContainerComponent} = await import("@order/presentation/component/details/order-details-container.component");

		await this.whacAMaleProvider.destroyComponent(OrderDetailsContainerComponent);

	}

	@Action(OrderActions.CloseForm)
	public async closeFormAction() {

		const {OrderFormContainerComponent} = await import("@order/presentation/component/form/order-form-container.component");

		await this.whacAMaleProvider.destroyComponent(OrderFormContainerComponent);

	}

	@Action(OrderActions.UpdateOpenedDetails)
	public async updateOpenedDetailsAction(ctx: StateContext<IOrderState>, {payload}: OrderActions.UpdateOpenedDetails) {

		import("@order/presentation/component/details/order-details-container.component")
			.then(({OrderDetailsContainerComponent}) => {

				const componentMirror = reflectComponentType(OrderDetailsContainerComponent);

				if (!componentMirror) {
					this.ngxLogger.error('OrderState.updateOpenedDetails', 'value of `component` property is not a component');
					return;
				}

				const componentRefList = this.whacAMaleProvider.componentRefMapByComponentName.get(componentMirror.selector);

				if (!componentRefList?.length) {
					this.ngxLogger.debug('OrderState.updateOpenedDetails Did not find', componentMirror.selector, this);
					return;
				}

				const {0: componentRef} = componentRefList;

				const {renderedComponentRef} = componentRef.instance;

				if (!renderedComponentRef) {
					this.ngxLogger.error('OrderState.updateOpenedDetails', 'renderedComponentRef is not defined');
					return;
				}

				if ('item' in renderedComponentRef.instance) {
					const {_id} = renderedComponentRef.instance.item;
					if (_id === payload._id) {
						renderedComponentRef.setInput('item', payload);
						return;
					}
					this.ngxLogger.error('OrderState.updateOpenedDetails', 'Item not found');
				}

			});

	}

	@Action(OrderActions.OpenDetails)
	public async openDetailsAction(ctx: StateContext<IOrderState>, {payload}: OrderActions.OpenDetails) {

		const title = await this.translateService.instant('order.details.title');

		const {OrderDetailsContainerComponent} = await import("@order/presentation/component/details/order-details-container.component");

		await this.whacAMaleProvider.buildItAsync({
			title,
			componentInputs: {
				item: payload
			},
			component: OrderDetailsContainerComponent,
		});

	}

	@Action(OrderActions.OpenDetailsById)
	public async openDetailsByIdAction(ctx: StateContext<IOrderState>, {payload: id}: OrderActions.OpenDetailsById) {

		const title = await this.translateService.instant('order.details.title');
		const item = await this.sharedUow.order.repository.findByIdAsync(id);

		if (!item) {
			this.ngxLogger.error('OrderState.openDetailsById', 'Item not found');
			return;
		}

		const {OrderDetailsContainerComponent} = await import("@order/presentation/component/details/order-details-container.component");

		await this.whacAMaleProvider.buildItAsync({
			title,
			component: OrderDetailsContainerComponent,
			componentInputs: {item},
		});

	}

	@Action(OrderActions.OpenFormToEditById)
	public async openFormToEditByIdAction(ctx: StateContext<IOrderState>, action: OrderActions.OpenFormToEditById) {

		const whacamoleId = 'edit-order-form-by-id-' + action.payload;

		if (this.whacAMaleProvider.componentRefMapById.has(whacamoleId)) {
			return;
		}

		const title = await this.translateService.instant('order.form.title.edit');
		const orderDto = await this.sharedUow.order.repository.findByIdAsync(action.payload);

		if (!orderDto) {
			this.ngxLogger.error('OrderState.openDetailsById', 'Item not found');
			return;
		}

		const {OrderFormContainerComponent} = await import("@order/presentation/component/form/order-form-container.component");

		const paymentEntity = await this.sharedUow.payment.findByOrderId(action.payload);

		await this.whacAMaleProvider.buildItAsync({
			title,
			id: whacamoleId,
			component: OrderFormContainerComponent,
			componentInputs: {
				orderDto,
				paymentDto: paymentEntity.at(-1),
				isEditMode: true,
			},
		});

	}

	@Action(OrderActions.OpenForm)
	public async openFormAction(ctx: StateContext<IOrderState>, {payload}: OrderActions.OpenForm): Promise<void> {

		const {OrderFormContainerComponent} = await import("@order/presentation/component/form/order-form-container.component");

		const {componentInputs, pushBoxInputs} = payload ?? {};

		await this.whacAMaleProvider.buildItAsync({
			title: this.translateService.instant('order.form.title.create'),
			...pushBoxInputs,
			component: OrderFormContainerComponent,
			componentInputs,
		});

	}

	// API

	@Action(OrderActions.ChangeStatus)
	public async changeStatusActionHandler(ctx: StateContext<IOrderState>, action: OrderActions.ChangeStatus): Promise<void> {
		const foundOrder = await this.sharedUow.order.repository.findByIdAsync(action.payload.id);
		if (!foundOrder) {
			return;
		}
		const orderEntity = EOrder.fromDTO(foundOrder);
		orderEntity.status = action.payload.status;
		await this.addNotificationSettingsToOrderEntity(orderEntity);
		await this.sharedUow.order.repository.updateAsync(orderEntity);

	}

	@Action(OrderActions.CreateItem)
	public async createItem(ctx: StateContext<IOrderState>, action: OrderActions.CreateItem) {
		/**
		 * Check customer:
		 * 1. If customerType === 'new' then we have to check in local storage if customer exists and
		 * 	  if not then create new customer, but if customer exists then we have to use it
		 */

		const orderEntity = EOrder.fromDTO(action.payload);


		// Resolve new customer case
		for (const service of orderEntity.services) {
			for (const attendee of service.orderAppointmentDetails.attendees) {
				if (attendee.customer.customerType === CustomerTypeEnum.new) {

					const customerFound = await this.sharedUow.customer.findOneByEmailPhone({
						email: attendee.customer.email,
						phone: attendee.customer.phone,
					})

					if (customerFound) {
						attendee.customer = ECustomer.fromRaw(customerFound).toDTO();
					} else {
						const customerEntity = ECustomer.fromDTO({
							...attendee.customer,
							customerType: CustomerTypeEnum.regular,
						});
						await this.sharedUow.customer.repository.createAsync(customerEntity);
						attendee.customer = customerEntity.toDTO();
					}
				}
			}
		}

		await this.addNotificationSettingsToOrderEntity(orderEntity);
		await this.sharedUow.order.repository.createAsync(orderEntity);
		await this.closeFormAction();
	}

	@Action(OrderActions.UpdateItem)
	public async updateItem(ctx: StateContext<IOrderState>, {payload: item}: OrderActions.UpdateItem): Promise<void> {
		const foundItems = await this.sharedUow.order.repository.findByIdAsync(item._id);
		if (foundItems) {

			const orderEntity = EOrder.fromRaw({
				...foundItems,
				...item,
			});

			await this.addNotificationSettingsToOrderEntity(orderEntity);
			await this.sharedUow.order.repository.updateAsync(orderEntity);
			await this.closeFormAction();
			await this.updateOpenedDetailsAction(ctx, {payload: orderEntity});

		}
	}

	@Action(OrderActions.GetItem)
	public async getItem(ctx: StateContext<IOrderState>, action: OrderActions.GetItem): Promise<void> {
		const raw = await this.sharedUow.order.repository.findByIdAsync(action.payload);

		if (!raw) {
			return;
		}

		const entity = EOrder.fromDTO(raw);

		ctx.patchState({
			item: {
				data: entity,
				downloadedAt: new Date(),
			}
		});
	}

	@Action(OrderActions.GetList)
	public async getList(ctx: StateContext<IOrderState>, action: OrderActions.GetList): Promise<void> {

		await firstValueFrom(ctx.dispatch(new AppActions.PageLoading(true)));

		const state = ctx.getState();

		try {

			const newTableState = TableState.fromCache(state.tableState);


			const {
				resetPage,
				resetParams
			} = action.payload ?? {};

			if (resetPage) {
				newTableState.setPage(1);
			}

			if (resetParams) {
				newTableState.filters = {};
			}

			const {statuses = [], ...params} = newTableState.toBackendFormat();

			const inState = (
				params?.state ?
					[params.state] :
					[StateEnum.active, StateEnum.archived, StateEnum.inactive]
			);

			const {items, totalSize} = await this.sharedUow.order.repository.findAsync({
				...params,
				state: inState,

				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				...(statuses?.length ? {
					status: statuses as OrderStatusEnum[],
				} : {}),

			});

			const entities = items.map(EOrder.fromDTO);

			newTableState
				.setTotal(totalSize)
				.setItems(entities)
				.setMaxPage(getMaxPage(newTableState.total, newTableState.pageSize));

			this.ngxLogger.debug('Table state: ', newTableState);

			ctx.patchState({
				tableState: newTableState.toCache(),
				lastTableHashSum: newTableState.hashSum
			});

		} catch (e) {
			this.ngxLogger.error(e);
		}

		// Switch of page loader
		await firstValueFrom(ctx.dispatch(new AppActions.PageLoading(false)));
	}

	@Action(OrderActions.SetState)
	public async setState(ctx: StateContext<IOrderState>, {item, state}: OrderActions.SetState) {
		const foundItems = await this.sharedUow.order.repository.findByIdAsync(item._id);
		if (foundItems) {
			const entity = EOrder.fromRaw(foundItems);
			entity.changeState(state);
			await this.sharedUow.order.repository.updateAsync(entity);
			await this.updateOpenedDetailsAction(ctx, {payload: entity});
			ctx.dispatch(new OrderActions.GetList());
		}
	}

	@Action(OrderActions.OrderedServiceStatus)
	public async orderedServiceStatus(ctx: StateContext<IOrderState>, {orderedServiceId, orderId, status}: OrderActions.OrderedServiceStatus) {
		const foundItems = await this.sharedUow.order.repository.findByIdAsync(orderId);
		if (foundItems) {
			const entity = EOrder.fromRaw(foundItems);
			entity.changeOrderedServiceStatus(orderedServiceId, status);
			await this.sharedUow.order.repository.updateAsync(entity);
			await this.updateOpenedDetailsAction(ctx, {payload: entity});
			ctx.dispatch(new OrderActions.GetList());
		}
	}

	@Action(OrderActions.OrderedServiceState)
	public async orderedServiceState(ctx: StateContext<IOrderState>, {orderedServiceId, orderId, state}: OrderActions.OrderedServiceState) {
		const foundItems = await this.sharedUow.order.repository.findByIdAsync(orderId);
		if (foundItems) {
			this.ngxLogger.debug('OrderState.orderedServiceState', foundItems);
			const entity = EOrder.fromRaw(foundItems);
			entity.changeOrderedServiceState(orderedServiceId, state);
			await this.sharedUow.order.repository.updateAsync(entity);
			await this.updateOpenedDetailsAction(ctx, {payload: entity});
			ctx.dispatch(new OrderActions.GetList());
		}
	}

	// Selectors

	@Selector()
	public static itemData(state: IOrderState) {
		return state.item.data;
	}

	@Selector()
	public static tableStateItems(state: IOrderState) {
		return state.tableState.items;
	}

	@Selector()
	public static tableState(state: IOrderState) {
		return state.tableState;
	}

	@Selector()
	public static tableStateFilters(state: IOrderState) {
		return state.tableState.filters;
	}

	/**
	 * Add notification settings to order entity
	 * @param orderEntity
	 * @private
	 */
	private async addNotificationSettingsToOrderEntity(orderEntity: EOrder): Promise<EOrder> {

		const notificationSettings = this.store.selectSnapshot(BusinessProfileState.notificationSettings);
		const askEmailNotifications = notificationSettings?.emailNotificationSettings?.sendNotificationConditionType === SendNotificationConditionEnum.ALLOW_BUT_ASK;
		const askSmsNotifications = notificationSettings?.smsNotificationSettings?.sendNotificationConditionType === SendNotificationConditionEnum.ALLOW_BUT_ASK;
		const needToShowNotificationsSettingModal = askEmailNotifications || askSmsNotifications;

		if (!needToShowNotificationsSettingModal) {
			return orderEntity;
		}

		return this.notificationSettingsFromModal({
			askEmailNotifications,
			askSmsNotifications
		}).then(({data}) => {

			if (data) {

				orderEntity.notificationSettings = {
					sendNotification: Boolean(data?.length),
					sendTypes: data,
					sendReceivers: ['business', 'client']
				} as INotificationSettings;

			}

			return orderEntity;


		})

	}

	/**
	 * Show notification settings modal
	 * @param data
	 * @private
	 */
	private async notificationSettingsFromModal(data: {
		askEmailNotifications: boolean,
		askSmsNotifications: boolean
	}): Promise<OverlayEventDetail<string[]>> {
		const {askEmailNotifications, askSmsNotifications} = data;
		const modal = await this.modalController.create({
			component: NotificationSettingsComponent,
			backdropDismiss: false,
			componentProps: {
				askEmailNotifications,
				askSmsNotifications,
			}
		});
		await modal.present();
		return modal.onWillDismiss<string[]>();
	}

}
