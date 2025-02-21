import {inject, Injectable, reflectComponentType} from "@angular/core";
import {Action, Selector, State, StateContext, Store} from "@ngxs/store";
import {baseDefaults, BaseState, IBaseState} from "@utility/state/base/base.state";
import {ActiveEnum, OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {TranslateService} from "@ngx-translate/core";
import {IOrder} from "@src/core/business-logic/order/interface/i.order";
import {OrderActions} from "@order/infrastructure/state/order/order.actions";
import {IOrderServiceDto} from "@src/core/business-logic/order/interface/i.order-service.dto";
import {ContainerFormComponent} from "@event/presentation/component/form/container.form.component";
import {IEvent} from "@event/domain";
import {ReservationTypeEnum} from "@src/core/business-logic/order/enum/reservation.type.enum";
import {ServiceOrderForm} from "@order/presentation/form/service.order.form";
import {WhacAMoleProvider} from "@utility/presentation/whac-a-mole/whac-a-mole.provider";
import {NGXLogger} from "ngx-logger";
import EOrder from "@src/core/business-logic/order/entity/e.order";
import {firstValueFrom} from "rxjs";
import {AppActions} from "@utility/state/app/app.actions";
import {TableState} from "@utility/domain/table.state";
import {getMaxPage} from "@utility/domain/max-page";
import {StateEnum} from "@core/shared/enum/state.enum";
import {CustomerTypeEnum} from "@src/core/business-logic/customer/enum/customer-type.enum";
import ECustomer from "@src/core/business-logic/customer/entity/e.customer";
import {CustomerService} from "@core/business-logic/customer/service/customer.service";
import {OrderService} from "@core/business-logic/order/service/order.service";
import {PaymentService} from "@core/business-logic/payment/service/payment.service";
import {OrderStatusEnum} from "@core/business-logic/order/enum/order.status.enum";
import {BusinessProfileState} from "@businessProfile/infrastructure/state/business-profile/business-profile.state";
import {SendNotificationConditionEnum} from "@core/shared/enum/send-notification-condition.enum";
import {OverlayEventDetail} from "@ionic/core/dist/types/utils/overlays-interface";
import {ModalController} from "@ionic/angular";
import {
	NotificationSettingsComponent
} from "@order/presentation/component/notification-settings/notification-settings.component";
import {INotificationSettings} from "@core/business-logic/order/interface/i.notification-settings";

export type IOrderState = IBaseState<IOrder.Entity>;

const defaults = baseDefaults<IOrder.Entity>({
	filters: {},
	orderBy: OrderByEnum.CREATED_AT,
	orderDir: OrderDirEnum.DESC,
	pageSize: 20
});

@State<IOrderState>({
	name: 'order',
	defaults,
})
@Injectable()
export class OrderState {

	private readonly customerService = inject(CustomerService);
	private readonly orderService = inject(OrderService);
	private readonly paymentService = inject(PaymentService);
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
		BaseState.updateTableState(ctx, action);
	}

	// Application layer

	@Action(OrderActions.CloseDetails)
	public async closeDetailsAction(ctx: StateContext<IOrderState>, action?: OrderActions.CloseDetails) {

		const {OrderDetailsContainerComponent} = await import("@order/presentation/component/details/order-details-container.component");

		await this.whacAMaleProvider.destroyComponent(OrderDetailsContainerComponent);

	}

	@Action(OrderActions.CloseForm)
	public async closeFormAction(ctx: StateContext<IOrderState>, action?: OrderActions.CloseForm) {

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
		const item = await this.orderService.repository.findByIdAsync(id);

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
		const orderDto = await this.orderService.repository.findByIdAsync(action.payload);

		if (!orderDto) {
			this.ngxLogger.error('OrderState.openDetailsById', 'Item not found');
			return;
		}

		const {OrderFormContainerComponent} = await import("@order/presentation/component/form/order-form-container.component");

		const paymentEntity = await this.paymentService.findByOrderId(action.payload);

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

	@Action(OrderActions.OpenOrderServiceForm)
	public async openOrderServiceFormAction(ctx: StateContext<IOrderState>, {payload}: OrderActions.OpenOrderServiceForm): Promise<void> {


		this.ngxLogger.info('openOrderServiceFormAction', payload);

		const {orderId, isEditMode, item} = payload;

		const componentInputs: {
			orderServiceDto: Partial<IOrderServiceDto>;
			isEditMode: boolean;
			forceStart?: string;
		} = {
			isEditMode: isEditMode ?? false,
			orderServiceDto: item ?? {},
		};

		const componentRef = await this.whacAMaleProvider.buildItAsync({
			title: this.translateService.instant('event.form.title.edit'),
			component: ContainerFormComponent,
			componentInputs,
		});

		if (!componentRef) {
			return;
		}

		const {renderedComponentRef} = componentRef.instance;

		if (!renderedComponentRef) {
			return;
		}

		renderedComponentRef.setInput('callback', async (component: ContainerFormComponent, formValue: IEvent) => {
			this.ngxLogger.info('callback', component, formValue);

			if (!formValue.services || !formValue.services.length) {
				return;
			}

			if (!formValue.attendees || !formValue.attendees.length) {
				return;
			}

			if (!formValue.timeZone) {
				return;
			}

			if (!formValue.start) {
				return;
			}

			if (!formValue.end) {
				return;
			}

			const orderServiceForm = ServiceOrderForm.create({
				...(formValue as any),
				customerNote: formValue.note,
				orderAppointmentDetails: {
					object: 'OrderAppointmentDetailsDto',
					active: ActiveEnum.YES,
					start: formValue.start,
					end: formValue.end,
					type: ReservationTypeEnum.service,
					languageCodes: [formValue.language],
					// attachments: IAttachmentDto[];
					specialists: formValue.specialists,
					attendees: formValue.attendees,
					// locations: ILocationsDto[];
					timeZone: formValue.timeZone,
					createdAt: formValue.createdAt,
					updatedAt: formValue.updatedAt,
				},
				serviceSnapshot: formValue.services[0] as unknown as IOrderServiceDto,
			});

			const order = await this.orderService.repository.findByIdAsync(orderId)

			if (order) {
				order.services.push(orderServiceForm.value as unknown as IOrderServiceDto);
				await this.orderService.repository.updateAsync(order);
			}

			// TODO: call function to increase defaultAppointmentStartDateTimeIso

			componentRef.instance.destroySelf()();

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
		const foundOrder = await this.orderService.repository.findByIdAsync(action.payload.id);
		if (!foundOrder) {
			return;
		}
		const orderEntity = EOrder.create(foundOrder);
		orderEntity.status = action.payload.status;
		await this.addNotificationSettingsToOrderEntity(orderEntity);
		await this.orderService.repository.updateAsync(orderEntity);

	}

	@Action(OrderActions.Delete)
	public async delete(ctx: StateContext<IOrderState>, action: OrderActions.Delete): Promise<void> {
		const foundOrder = await this.orderService.repository.findByIdAsync(action.payload.id);
		if (!foundOrder) {
			return;
		}
		const orderEntity = EOrder.create(foundOrder);
		orderEntity.changeState(StateEnum.deleted);
		await this.addNotificationSettingsToOrderEntity(orderEntity);
		await this.orderService.repository.updateAsync(orderEntity);
		ctx.dispatch(new OrderActions.GetList());
	}

	@Action(OrderActions.CreateItem)
	public async createItem(ctx: StateContext<IOrderState>, action: OrderActions.CreateItem) {
		/**
		 * Check customer:
		 * 1. If customerType === 'new' then we have to check in local storage if customer exists and
		 * 	  if not then create new customer, but if customer exists then we have to use it
		 */

		const orderEntity = EOrder.create(action.payload);


		// Resolve new customer case
		for (const service of orderEntity.services) {
			for (const attendee of service.orderAppointmentDetails.attendees) {
				if (attendee.customer.customerType === CustomerTypeEnum.new) {

					const customerFound = await this.customerService.findOneByEmailPhone({
						email: attendee.customer.email,
						phone: attendee.customer.phone,
					})

					if (customerFound) {
						attendee.customer = customerFound.toDTO();
					} else {
						const customerEntity = ECustomer.create({
							...attendee.customer,
							customerType: CustomerTypeEnum.regular,
						});
						await this.customerService.repository.createAsync(customerEntity);
						attendee.customer = customerEntity.toDTO();
					}
				}
			}
		}

		await this.addNotificationSettingsToOrderEntity(orderEntity);
		await this.orderService.repository.createAsync(orderEntity);
		await this.closeFormAction(ctx);
	}

	@Action(OrderActions.UpdateItem)
	public async updateItem(ctx: StateContext<IOrderState>, action: OrderActions.UpdateItem): Promise<void> {
		const orderEntity = EOrder.create(action.payload);
		await this.addNotificationSettingsToOrderEntity(orderEntity);
		await this.orderService.repository.updateAsync(orderEntity);
		await this.closeFormAction(ctx);
		await this.updateOpenedDetailsAction(ctx, {payload: orderEntity});
	}

	@Action(OrderActions.GetItem)
	public async getItem(ctx: StateContext<IOrderState>, action: OrderActions.GetItem): Promise<void> {
		const data = await this.orderService.repository.findByIdAsync(action.payload);

		if (!data) {
			return;
		}

		ctx.patchState({
			item: {
				data,
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

			const {items, totalSize} = await this.orderService.repository.findAsync({
				...params,
				state: inState,

				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				...(statuses?.length ? {
					status: statuses as OrderStatusEnum[],
				} : {}),

			});

			newTableState
				.setTotal(totalSize)
				.setItems(items)
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

			//
			// const updatedBody = {
			// 	...req.body as object,
			// 	// TODO move Receivers to UI settings
			// 	notificationSettings: {
			// 		sendNotification: Boolean(resp.data?.length),
			// 		sendTypes: resp.data,
			// 		sendReceivers: ['business', 'client']
			// 	}
			// }
			// return next(req.clone({body: updatedBody}))

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
