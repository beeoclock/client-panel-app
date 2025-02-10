import {inject, Injectable, reflectComponentType} from "@angular/core";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import {baseDefaults, BaseState, IBaseState} from "@utility/state/base/base.state";
import {ActiveEnum, OrderByEnum, OrderDirEnum} from "@utility/domain/enum";
import {TranslateService} from "@ngx-translate/core";
import {UpdateOrderApiAdapter} from "@order/infrastructure/api/update.order.api.adapter";
import {IOrderDto} from "@order/domain/interface/details/i.order.dto";
import {OrderActions} from "@order/state/order/order.actions";
import {PagedPaymentApiAdapter} from "@module/payment/external/adapter/api/paged.payment.api.adapter";
import {UpdateServiceOrderApiAdapter} from "@order/infrastructure/api/update.service.order.api.adapter";
import {IOrderServiceDto} from "@order/domain/interface/i.order-service.dto";
import {ContainerFormComponent} from "@event/presentation/component/form/container.form.component";
import {IEvent} from "@event/domain";
import {ReservationTypeEnum} from "@order/domain/enum/reservation.type.enum";
import {IServiceDto} from "@order/domain/interface/i.service.dto";
import {ServiceOrderForm} from "@order/presentation/form/service.order.form";
import {PatchStatusOrderApiAdapter} from "@order/infrastructure/api/status/patch.status.order.api.adapter";
import {WhacAMoleProvider} from "@utility/presentation/whac-a-mole/whac-a-mole.provider";
import {NGXLogger} from "ngx-logger";
import {OrderIndexedDBFacade} from "@order/infrastructure/facade/indexedDB/order.indexedDB.facade";
import EOrder from "@order/domain/entity/e.order";
import {firstValueFrom} from "rxjs";
import {AppActions} from "@utility/state/app/app.actions";
import {TableState} from "@utility/domain/table.state";
import {getMaxPage} from "@utility/domain/max-page";
import {StateEnum} from "@utility/domain/enum/state.enum";

export type IOrderState = IBaseState<IOrderDto>;

const defaults = baseDefaults<IOrderDto>({
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

	private readonly updateServiceOrderApiAdapter = inject(UpdateServiceOrderApiAdapter);
	private readonly patchStatusOrderApiAdapter = inject(PatchStatusOrderApiAdapter);

	private readonly updateOrderApiAdapter = inject(UpdateOrderApiAdapter);
	private readonly pagedPaymentApiAdapter = inject(PagedPaymentApiAdapter);

	public readonly orderIndexedDBFacade = inject(OrderIndexedDBFacade);

	private readonly whacAMaleProvider = inject(WhacAMoleProvider);
	private readonly translateService = inject(TranslateService);
	private readonly ngxLogger = inject(NGXLogger);

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
		const item = this.orderIndexedDBFacade.source.findOne({
			id
		});

		if (!item) {
			this.ngxLogger.error('OrderState.openDetailsById', 'Item not found');
			return;
		}

		const {OrderDetailsContainerComponent} = await import("@order/presentation/component/details/order-details-container.component");

		await this.whacAMaleProvider.buildItAsync({
			title,
			showLoading: true,
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
		const orderDto = this.orderIndexedDBFacade.source.findOne({
			id: action.payload
		});

		if (!orderDto) {
			this.ngxLogger.error('OrderState.openDetailsById', 'Item not found');
			return;
		}

		const {OrderFormContainerComponent} = await import("@order/presentation/component/form/order-form-container.component");

		await this.whacAMaleProvider.buildItAsync({
			title,
			id: whacamoleId,
			component: OrderFormContainerComponent,
			componentInputs: {},
			showLoading: true,
		});

		const paymentResponse = await this.pagedPaymentApiAdapter.executeAsync({
			orderId: action.payload,
			page: 1,
			pageSize: 1,
			orderBy: OrderByEnum.CREATED_AT,
			orderDir: OrderDirEnum.DESC,
		});
		const paymentDto = paymentResponse.items[0];

		await this.whacAMaleProvider.buildItAsync({
			title,
			id: whacamoleId,
			component: OrderFormContainerComponent,
			componentInputs: {
				orderDto,
				paymentDto,
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

		renderedComponentRef.setInput('callback', (component: ContainerFormComponent, formValue: IEvent) => {
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
				serviceSnapshot: {
					...formValue.services[0],
					object: "ServiceDto",
				} as unknown as IServiceDto,
			});

			this.updateServiceOrderApiAdapter.executeAsync(orderId, orderServiceForm.value);

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
		await this.patchStatusOrderApiAdapter.executeAsync(action.payload.id, action.payload.status);
	}

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

	@Action(OrderActions.CreateItem)
	public async createItem(ctx: StateContext<IOrderState>, action: OrderActions.CreateItem) {
		this.orderIndexedDBFacade.source.insert(EOrder.create(action.payload));
		await this.closeFormAction(ctx);
	}

	@Action(OrderActions.UpdateItem)
	public async updateItem(ctx: StateContext<IOrderState>, action: OrderActions.UpdateItem): Promise<void> {

		const item = EOrder.create(action.payload);
		this.orderIndexedDBFacade.source.updateOne({
			id: action.payload._id,
		}, {
			$set: item
		});
		await this.closeFormAction(ctx);
		await this.updateOpenedDetailsAction(ctx, {payload: item});

		// await super.updateItem(ctx, action);
		// ctx.dispatch(new OrderActions.CloseForm(action.payload._id))
		// const {data} = ctx.getState().item;
		// if (data) ctx.dispatch(new OrderActions.UpdateOpenedDetails(data));
	}

	@Action(OrderActions.GetItem)
	public async getItem(ctx: StateContext<IOrderState>, action: OrderActions.GetItem): Promise<void> {
		const data = this.orderIndexedDBFacade.source.findOne({
			id: action.payload
		});

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

	@Action(OrderActions.DeleteItem)
	public async deleteItem(ctx: StateContext<IOrderState>, action: OrderActions.DeleteItem) {
		this.orderIndexedDBFacade.source.removeOne({
			id: action.payload
		});
		await this.closeDetailsAction(ctx, action);
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


			const params = newTableState.toBackendFormat();

			const selector = {
				$and: [
					{
						state: {
							$in: [StateEnum.active, StateEnum.archived, StateEnum.inactive]
						}
					}
				]
			};

			const items = this.orderIndexedDBFacade.source.find(selector, {
				limit: params.pageSize,
				skip: (params.page - 1) * params.pageSize,
				sort: {
					[params.orderBy]: params.orderDir === OrderDirEnum.ASC ? 1 : -1
				}
			}).fetch();

			const count = this.orderIndexedDBFacade.source.find(selector).count();

			newTableState
				.setTotal(count)
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

	@Action(OrderActions.PutItem)
	public async putItem(ctx: StateContext<IOrderState>, action: OrderActions.PutItem): Promise<void> {
		await this.updateOrderApiAdapter.executeAsync(action.payload.item);
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

}
