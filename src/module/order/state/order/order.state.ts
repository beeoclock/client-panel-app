import {inject, Injectable} from "@angular/core";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import {baseDefaults, BaseState, IBaseState} from "@utility/state/base/base.state";
import {OrderByEnum, OrderDirEnum} from "@utility/domain/enum";
import {TranslateService} from "@ngx-translate/core";
import {CreateOrderApiAdapter} from "@order/external/adapter/api/create.order.api.adapter";
import {UpdateOrderApiAdapter} from "@order/external/adapter/api/update.order.api.adapter";
import {DetailsOrderApiAdapter} from "@order/external/adapter/api/details.order.api.adapter";
import {PagedOrderApiAdapter} from "@order/external/adapter/api/paged.order.api.adapter";
import {DeleteOrderApiAdapter} from "../../external/adapter/api/delete.order.api.adapter";
import {IOrderDto} from "@order/external/interface/details/i.order.dto";
import {OrderActions} from "@order/state/order/order.actions";

export type IOrderState = IBaseState<IOrderDto>;

const defaults = baseDefaults<IOrderDto>({
	filters: {},
	orderBy: OrderByEnum.CREATED_AT,
	orderDir: OrderDirEnum.DESC,
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

	private readonly translateService = inject(TranslateService);

	constructor() {
		super(
			defaults,
		);
	}

	// Application layer

	@Action(OrderActions.CloseDetails)
	public async closeDetailsAction(ctx: StateContext<IOrderState>, action?: OrderActions.CloseDetails) {

		const {OrderDetailsContainerComponent} = await import("@order/presentation/component/details/order-details-container.component");

		if (action?.payload) {
			this.pushBoxService.destroy$.next(OrderDetailsContainerComponent.name + '_' + action?.payload);
			return;
		}

		this.pushBoxService.destroyByComponentName$.next(OrderDetailsContainerComponent.name);

	}

	@Action(OrderActions.CloseForm)
	public async closeFormAction(ctx: StateContext<IOrderState>, action?: OrderActions.CloseForm) {

		if (action?.payload) {
			this.pushBoxService.destroy$.next(action?.payload);
			return;
		}

		const {OrderFormContainerComponent} = await import("@order/presentation/component/form/order-form-container.component");

		this.pushBoxService.destroyByComponentName$.next(OrderFormContainerComponent.name);

	}

	@Action(OrderActions.UpdateOpenedDetails)
	public async updateOpenedDetailsAction(ctx: StateContext<IOrderState>, {payload}: OrderActions.UpdateOpenedDetails) {

		const {OrderDetailsContainerComponent} = await import("@order/presentation/component/details/order-details-container.component");

		await this.pushBoxService.updatePushBoxComponentAsync({
			id: payload._id,
			useComponentNameAsPrefixOfId: true,
			component: OrderDetailsContainerComponent,
			componentInputs: {item: payload},
		});

	}

	@Action(OrderActions.OpenDetailsById)
	public async openDetailsByIdAction(ctx: StateContext<IOrderState>, {payload: id}: OrderActions.OpenDetailsById) {

		const title = await this.translateService.instant('order.details.title');

		const {OrderDetailsContainerComponent} = await import("@order/presentation/component/details/order-details-container.component");

		await this.pushBoxService.buildItAsync({
			id,
			title,
			showLoading: true,
			useComponentNameAsPrefixOfId: true,
			component: OrderDetailsContainerComponent,
		});

		const item = await this.item.executeAsync(id);

		await this.pushBoxService.updatePushBoxComponentAsync({
			id,
			useComponentNameAsPrefixOfId: true,
			component: OrderDetailsContainerComponent,
			componentInputs: {item},
		});

	}

	@Action(OrderActions.OpenFormToEditById)
	public async openFormToEditByIdAction(ctx: StateContext<IOrderState>, action: OrderActions.OpenFormToEditById) {

		const title = await this.translateService.instant('order.form.title.edit');

		const {OrderFormContainerComponent} = await import("@order/presentation/component/form/order-form-container.component");

		await this.pushBoxService.buildItAsync({
			title,
			id: action.payload,
			component: OrderFormContainerComponent,
			componentInputs: {},
		});

		const item = await this.item.executeAsync(action.payload);

		await this.pushBoxService.buildItAsync({
			title,
			id: action.payload,
			component: OrderFormContainerComponent,
			componentInputs: {
				item,
				isEditMode: true,
			},
		});

	}

	@Action(OrderActions.OpenForm)
	public async openFormAction(ctx: StateContext<IOrderState>, {payload}: OrderActions.OpenForm): Promise<void> {

		const {OrderFormContainerComponent} = await import("@order/presentation/component/form/order-form-container.component");

		const {componentInputs, pushBoxInputs} = payload ?? {};

		await this.pushBoxService.buildItAsync({
			id: OrderFormContainerComponent.name,
			title: this.translateService.instant('order.form.title.create'),
			...pushBoxInputs,
			component: OrderFormContainerComponent,
			componentInputs,
		});

	}

	// API

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
