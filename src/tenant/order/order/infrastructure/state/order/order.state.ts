import {inject, Injectable} from "@angular/core";
import {Action, State, StateContext, Store} from "@ngxs/store";
import {baseDefaults, IBaseState} from "@shared/state/base/base.state";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {TranslateService} from "@ngx-translate/core";
import {OrderActions} from "@tenant/order/order/infrastructure/state/order/order.actions";
import {NGXLogger} from "ngx-logger";
import EOrder from "@tenant/order/order/domain/entity/e.order";
import {StateEnum} from "@core/shared/enum/state.enum";
import {OrderStatusEnum} from "@tenant/order/order/domain/enum/order.status.enum";
import {
	BusinessProfileState
} from "@tenant/business-profile/infrastructure/state/business-profile/business-profile.state";
import {SendNotificationConditionEnum} from "@core/shared/enum/send-notification-condition.enum";
import {OverlayEventDetail} from "@ionic/core/dist/types/utils/overlays-interface";
import {ModalController} from "@ionic/angular/standalone";
import {
	NotificationSettingsComponent
} from "@tenant/order/order/presentation/ui/component/notification-settings/notification-settings.component";
import {INotificationSettings} from "@tenant/order/order/domain/interface/i.notification-settings";
import {environment} from "@environment/environment";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {Router} from "@angular/router";
import {SecondRouterOutletService} from "@src/second.router-outlet.service";
import OrderDetailsContainerComponent
	from "@tenant/order/order/presentation/ui/component/details/order-details-container.component";
import OrderFormContainerComponent
	from "@tenant/order/order/presentation/ui/component/form/order-form-container.component";
import {firstValueFrom} from "rxjs";
import EOrderService from "@tenant/order/order-service/domain/entity/e.order-service";
import {NewCustomerUseCase} from "@tenant/order/order/application/use-case/new-customer.use-case";

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

	private readonly translateService = inject(TranslateService);
	private readonly ngxLogger = inject(NGXLogger);
	private readonly router = inject(Router);
	private readonly secondRouterOutletService = inject(SecondRouterOutletService);

	@Action(OrderActions.Init)
	public async init(ctx: StateContext<IOrderState>): Promise<void> {
		ctx.setState(structuredClone(defaults));
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

		const orderDto = await this.sharedUow.order.repository.findByIdAsync(action.payload);

		if (!orderDto) {
			this.ngxLogger.error('OrderState.openDetailsById', 'Item not found');
			return;
		}

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

	}

	// API

	@Action(OrderActions.ChangeStatus)
	public async changeStatusActionHandler(ctx: StateContext<IOrderState>, action: OrderActions.ChangeStatus): Promise<void> {
		const orderEntity = EOrder.fromRaw(action.payload.item);
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

		const newCustomerUseCase = new NewCustomerUseCase(this.sharedUow, orderEntity);
		await newCustomerUseCase.execute();

		await this.addNotificationSettingsToOrderEntity(orderEntity);
		await this.sharedUow.order.repository.createAsync(orderEntity);

		for (const service of orderEntity.services) {
			const orderServiceEntity = EOrderService.fromRaw(service);
			await this.sharedUow.orderService.repository.createAsync(orderServiceEntity);
		}

		await this.closeFormAction();
	}

	@Action(OrderActions.UpdateItem)
	public async updateItem(ctx: StateContext<IOrderState>, {payload: item}: OrderActions.UpdateItem): Promise<void> {
		const foundItem = await this.sharedUow.order.repository.findByIdAsync(item._id);
		if (foundItem) {

			const orderEntity = EOrder.fromRaw({
				...foundItem,
				...item,
			});

			await this.addNotificationSettingsToOrderEntity(orderEntity);
			await this.sharedUow.order.repository.updateAsync(orderEntity);

			for (const service of orderEntity.services) {
				const orderServiceEntity = EOrderService.fromRaw(service);
				await this.sharedUow.orderService.repository.updateAsync(orderServiceEntity);
			}

			await this.closeFormAction();

			const actions: any[] = [];
			if (orderEntity.state === StateEnum.deleted) {
				actions.push(new OrderActions.CloseDetails());
			} else {
				actions.push(new OrderActions.UpdateOpenedDetails(orderEntity));
			}
			const actions$ = ctx.dispatch(actions);
			await firstValueFrom(actions$);

		}
	}

	@Action(OrderActions.SetState)
	public async setState(ctx: StateContext<IOrderState>, {item, state}: OrderActions.SetState) {
		const foundItems = await this.sharedUow.order.repository.findByIdAsync(item._id);
		if (foundItems) {
			const entity = EOrder.fromRaw(foundItems);
			entity.changeState(state);

			await this.sharedUow.order.repository.updateAsync(entity);

			for (const service of entity.services) {
				const orderServiceEntity = EOrderService.fromRaw(service);
				await this.sharedUow.orderService.repository.updateAsync(orderServiceEntity);
			}

			const actions: any[] = [];
			if (entity.state === StateEnum.deleted) {
				actions.push(new OrderActions.CloseDetails());
			} else {
				actions.push(new OrderActions.UpdateOpenedDetails(entity));
			}
			const actions$ = ctx.dispatch(actions);
			await firstValueFrom(actions$);
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

			const orderServiceRaw = entity.services.find((service) => service._id === orderedServiceId);
			if (orderServiceRaw) {
				const orderServiceEntity = EOrderService.fromRaw(orderServiceRaw);
				await this.sharedUow.orderService.repository.updateAsync(orderServiceEntity);
			}

			const actions: any[] = [];
			if (entity.state === StateEnum.deleted) {
				actions.push(new OrderActions.CloseDetails());
			} else {
				actions.push(new OrderActions.UpdateOpenedDetails(entity));
			}
			const actions$ = ctx.dispatch(actions);
			await firstValueFrom(actions$);
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
			const orderServiceRaw = entity.services.find((service) => service._id === orderedServiceId);
			if (orderServiceRaw) {
				const orderServiceEntity = EOrderService.fromRaw(orderServiceRaw);
				await this.sharedUow.orderService.repository.updateAsync(orderServiceEntity);
			}

			const actions: any[] = [];
			if (entity.state === StateEnum.deleted) {
				actions.push(new OrderActions.CloseDetails());
			} else {
				actions.push(new OrderActions.UpdateOpenedDetails(entity));
			}
			const actions$ = ctx.dispatch(actions);
			await firstValueFrom(actions$);

		}
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
