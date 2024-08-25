import {inject, Injectable} from "@angular/core";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import {baseDefaults, BaseState, IBaseState} from "@utility/state/base/base.state";
import {ActiveEnum, OrderByEnum, OrderDirEnum} from "@utility/domain/enum";
import {TranslateService} from "@ngx-translate/core";
import {CreateOrderApiAdapter} from "@order/external/adapter/api/create.order.api.adapter";
import {UpdateOrderApiAdapter} from "@order/external/adapter/api/update.order.api.adapter";
import {DetailsOrderApiAdapter} from "@order/external/adapter/api/details.order.api.adapter";
import {PagedOrderApiAdapter} from "@order/external/adapter/api/paged.order.api.adapter";
import {DeleteOrderApiAdapter} from "../../external/adapter/api/delete.order.api.adapter";
import {IOrderDto} from "@order/external/interface/details/i.order.dto";
import {OrderActions} from "@order/state/order/order.actions";
import {PagedPaymentApiAdapter} from "@module/payment/external/adapter/api/paged.payment.api.adapter";
import {UpdateServiceOrderApiAdapter} from "@order/external/adapter/api/update.service.order.api.adapter";
import {IOrderServiceDto} from "@order/external/interface/i.order-service.dto";
import {ContainerFormComponent} from "@event/presentation/component/form/container.form.component";
import {IEvent} from "@event/domain";
import {ReservationTypeEnum} from "@order/domain/enum/reservation.type.enum";
import {IServiceDto} from "@order/external/interface/i.service.dto";
import {ServiceOrderForm} from "@order/presentation/form/service.order.form";
import {PatchStatusOrderApiAdapter} from "@order/external/adapter/api/status/patch.status.order.api.adapter";

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
export class OrderState extends BaseState<IOrderDto> {

	protected override readonly create = inject(CreateOrderApiAdapter);
	protected override readonly update = inject(UpdateOrderApiAdapter);
	protected override readonly item = inject(DetailsOrderApiAdapter);
	protected override readonly delete = inject(DeleteOrderApiAdapter);
	protected override readonly paged = inject(PagedOrderApiAdapter);

	private readonly updateServiceOrderApiAdapter = inject(UpdateServiceOrderApiAdapter);
	private readonly paymentPaged = inject(PagedPaymentApiAdapter);
	private readonly translateService = inject(TranslateService);
	private readonly patchStatusOrderApiAdapter = inject(PatchStatusOrderApiAdapter);

	constructor() {
		super(
			defaults,
		);
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

		const {OrderDetailsContainerComponent} = await import("@order/presentation/component/details/order-details-container.component");

		await this.whacAMaleProvider.updateWhacAMoleComponentAsync({
			component: OrderDetailsContainerComponent,
			componentInputs: {item: payload},
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

		const {OrderDetailsContainerComponent} = await import("@order/presentation/component/details/order-details-container.component");

		await this.whacAMaleProvider.buildItAsync({
			title,
			showLoading: true,
			component: OrderDetailsContainerComponent,
		});

		const item = await this.item.executeAsync(id);

		await this.whacAMaleProvider.updateWhacAMoleComponentAsync({
			component: OrderDetailsContainerComponent,
			componentInputs: {item},
		});

	}

	@Action(OrderActions.OpenFormToEditById)
	public async openFormToEditByIdAction(ctx: StateContext<IOrderState>, action: OrderActions.OpenFormToEditById) {

		const title = await this.translateService.instant('order.form.title.edit');

		const {OrderFormContainerComponent} = await import("@order/presentation/component/form/order-form-container.component");

		await this.whacAMaleProvider.buildItAsync({
			title,
			component: OrderFormContainerComponent,
			componentInputs: {},
			showLoading: true,
		});

		const orderDto = await this.item.executeAsync(action.payload);
		const paymentResponse = await this.paymentPaged.executeAsync({
			orderId: action.payload,
			page: 1,
			pageSize: 1,
			orderBy: OrderByEnum.CREATED_AT,
			orderDir: OrderDirEnum.DESC,
		});
		const paymentDto = paymentResponse.items[0];

		await this.whacAMaleProvider.buildItAsync({
			title,
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

			componentRef.instance.destroySelf();

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
	public override async init(ctx: StateContext<IOrderState>): Promise<void> {
		await super.init(ctx);
	}

	@Action(OrderActions.UpdateFilters)
	public override updateFilters(ctx: StateContext<IOrderState>, action: OrderActions.UpdateFilters) {
		super.updateFilters(ctx, action);
	}

	@Action(OrderActions.UpdateTableState)
	public override updateTableState(ctx: StateContext<IOrderState>, action: OrderActions.UpdateTableState) {
		super.updateTableState(ctx, action);
	}

	@Action(OrderActions.CreateItem)
	public override async createItem(ctx: StateContext<IOrderState>, action: OrderActions.CreateItem) {
		await super.createItem(ctx, action);
		await this.closeFormAction(ctx);
	}

	@Action(OrderActions.UpdateItem)
	public override async updateItem(ctx: StateContext<IOrderState>, action: OrderActions.UpdateItem): Promise<void> {
		await super.updateItem(ctx, action);
		await this.closeFormAction(ctx, {
			payload: action.payload._id
		});
		const {data} = ctx.getState().item;
		data && await this.updateOpenedDetailsAction(ctx, {payload: data});
	}

	@Action(OrderActions.GetItem)
	public override async getItem(ctx: StateContext<IOrderState>, action: OrderActions.GetItem): Promise<void> {
		await super.getItem(ctx, action);
	}

	@Action(OrderActions.DeleteItem)
	public override async deleteItem(ctx: StateContext<IOrderState>, action: OrderActions.DeleteItem) {
		await super.deleteItem(ctx, action);
		await this.closeDetailsAction(ctx, action);
	}

	@Action(OrderActions.GetList)
	public override async getList(ctx: StateContext<IOrderState>, action: OrderActions.GetList): Promise<void> {
		await super.getList(ctx, action);
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
