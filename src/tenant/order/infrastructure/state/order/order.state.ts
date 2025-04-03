import {inject, Injectable} from "@angular/core";
import {Action, Selector, State, StateContext, Store} from "@ngxs/store";
import {baseDefaults, BaseState, IBaseState} from "@shared/state/base/base.state";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {TranslateService} from "@ngx-translate/core";
import {OrderActions} from "@tenant/order/infrastructure/state/order/order.actions";
import {WhacAMoleProvider} from "@shared/presentation/whac-a-mole/whac-a-mole.provider";
import {NGXLogger} from "ngx-logger";
import EOrder from "@tenant/order/domain/entity/e.order";
import {firstValueFrom} from "rxjs";
import {AppActions} from "@shared/state/app/app.actions";
import {TableState} from "@shared/domain/table.state";
import {getMaxPage} from "@shared/domain/max-page";
import {StateEnum} from "@core/shared/enum/state.enum";
import {CustomerTypeEnum} from "@tenant/customer/domain/enum/customer-type.enum";
import ECustomer from "@tenant/customer/domain/entity/e.customer";
import {OrderStatusEnum} from "@tenant/order/domain/enum/order.status.enum";
import {
	BusinessProfileState
} from "@tenant/business-profile/infrastructure/state/business-profile/business-profile.state";
import {SendNotificationConditionEnum} from "@core/shared/enum/send-notification-condition.enum";
import {OverlayEventDetail} from "@ionic/core/dist/types/utils/overlays-interface";
import {ModalController} from "@ionic/angular/standalone";
import {
	NotificationSettingsComponent
} from "@tenant/order/presentation/ui/component/notification-settings/notification-settings.component";
import {INotificationSettings} from "@tenant/order/domain/interface/i.notification-settings";
import {environment} from "@environment/environment";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {Router} from "@angular/router";
import {SecondRouterOutletService} from "@src/second.router-outlet.service";
import OrderDetailsContainerComponent
	from "@tenant/order/presentation/ui/component/details/order-details-container.component";
import OrderFormContainerComponent from "@tenant/order/presentation/ui/component/form/order-form-container.component";

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
	private readonly router = inject(Router);
	private readonly secondRouterOutletService = inject(SecondRouterOutletService);

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
		await this.router.navigate([{outlets: {second: null}}]);
	}

	@Action(OrderActions.CloseForm)
	public async closeFormAction() {
		await this.router.navigate([{outlets: {second: null}}]);
	}

	@Action(OrderActions.UpdateOpenedDetails)
	public async updateOpenedDetailsAction(ctx: StateContext<IOrderState>, {payload}: OrderActions.UpdateOpenedDetails) {
		await this.router.navigate([{outlets: {second: ['order', payload._id]}}], {
			onSameUrlNavigation: 'reload',
		});
	}

	@Action(OrderActions.OpenDetails)
	public async openDetailsAction(ctx: StateContext<IOrderState>, {payload}: OrderActions.OpenDetails) {

		const activated = this.secondRouterOutletService.activated();

		if (activated) {
			if (activated instanceof OrderDetailsContainerComponent) {
				const {_id} = activated.item() ?? {};
				if (_id === payload._id) {
					ctx.dispatch(new OrderActions.CloseDetails());
					return;
				}
			}
		}

		await this.router.navigate([{outlets: {second: ['order', payload._id]}}]);

	}

	@Action(OrderActions.OpenFormToEditById)
	public async openFormToEditByIdAction(ctx: StateContext<IOrderState>, action: OrderActions.OpenFormToEditById) {

		// const whacamoleId = 'edit-order-form-by-id-' + action.payload;
		//
		// if (this.whacAMaleProvider.componentRefMapById.has(whacamoleId)) {
		// 	return;
		// }

		// const title = await this.translateService.instant('order.form.title.edit');
		const orderDto = await this.sharedUow.order.repository.findByIdAsync(action.payload);

		if (!orderDto) {
			this.ngxLogger.error('OrderState.openDetailsById', 'Item not found');
			return;
		}

		// const {OrderFormContainerComponent} = await import("@tenant/order/presentation/ui/component/form/order-form-container.component");
		//
		// const paymentEntity = await this.sharedUow.payment.findByOrderId(action.payload);

		// await this.whacAMaleProvider.buildItAsync({
		// 	title,
		// 	id: whacamoleId,
		// 	component: OrderFormContainerComponent,
		// 	componentInputs: {
		// 		orderDto,
		// 		paymentDto: paymentEntity.at(-1),
		// 		isEditMode: true,
		// 	},
		// });

		ctx.dispatch(new OrderActions.OpenForm({
			componentInputs: {
				item: orderDto,
				isEditMode: true
			},
		}));

	}

	@Action(OrderActions.OpenForm)
	public async openFormAction(ctx: StateContext<IOrderState>, {payload}: OrderActions.OpenForm): Promise<void> {

		const activated = this.secondRouterOutletService.activated();

		if (activated) {
			if (activated instanceof OrderFormContainerComponent) {
				const isEditMode = activated.isEditMode();
				if (isEditMode) {
					const {_id} = activated.order() ?? {};
					if (_id === payload?.componentInputs?.item?._id) {
						const action = new OrderActions.CloseForm();
						ctx.dispatch(action);
						return;
					}
				} else {
					const action = new OrderActions.CloseForm();
					ctx.dispatch(action);
					return;
				}
			}
		}

		if (payload?.componentInputs?.isEditMode) {
			await this.router.navigate([{outlets: {second: ['order', payload.componentInputs.item?._id, 'form']}}]);
		} else {

			let customerJSON = '';
			let memberJSON = '';
			let appointmentStartDateTimeIso = '';
			let serviceListJSON = '';

			const {componentInputs} = payload ?? {};
			if (componentInputs) {
				const {setupPartialData} = componentInputs;
				if (setupPartialData) {
					const {
						customer,
						defaultMemberForService: member,
						defaultAppointmentStartDateTimeIso,
						serviceList
					} = setupPartialData;
					if (customer) {
						customerJSON = JSON.stringify(customer);
					}
					if (member) {
						memberJSON = JSON.stringify(member);
					}
					if (defaultAppointmentStartDateTimeIso) {
						appointmentStartDateTimeIso = defaultAppointmentStartDateTimeIso;
					}
					if (serviceList) {
						serviceListJSON = JSON.stringify(serviceList);
					}
				}
			}

			await this.router.navigate([{outlets: {second: ['order', 'form']}}], {
				queryParams: {
					customerJSON,
					memberJSON,
					appointmentStartDateTimeIso,
					serviceListJSON,
				}
			});

		}

		// const {OrderFormContainerComponent} = await import("@tenant/order/presentation/ui/component/form/order-form-container.component");
		//
		// const {componentInputs, pushBoxInputs} = payload ?? {};
		//
		// await this.whacAMaleProvider.buildItAsync({
		// 	title: this.translateService.instant('order.form.title.create'),
		// 	...pushBoxInputs,
		// 	component: OrderFormContainerComponent,
		// 	componentInputs,
		// });

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
	public async orderedServiceStatus(ctx: StateContext<IOrderState>, {
		orderedServiceId,
		orderId,
		status
	}: OrderActions.OrderedServiceStatus) {
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
	public async orderedServiceState(ctx: StateContext<IOrderState>, {
		orderedServiceId,
		orderId,
		state
	}: OrderActions.OrderedServiceState) {
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
