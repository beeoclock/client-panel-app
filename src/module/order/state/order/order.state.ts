import {inject, Injectable} from "@angular/core";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import {baseDefaults, IBaseState} from "@utility/state/base/base.state";
import {OrderByEnum, OrderDirEnum} from "@utility/domain/enum";
import {TranslateService} from "@ngx-translate/core";
import {AppActions} from "@utility/state/app/app.actions";
import {NGXLogger} from "ngx-logger";
import {PushBoxService} from "@utility/presentation/component/push-box/push-box.service";
import {firstValueFrom} from "rxjs";
import {TableState} from "@utility/domain/table.state";
import {getMaxPage} from "@utility/domain/max-page";
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
export class OrderState {

	private readonly create = inject(CreateOrderApiAdapter);
	private readonly update = inject(UpdateOrderApiAdapter);
	private readonly item = inject(DetailsOrderApiAdapter);
	private readonly delete = inject(DeleteOrderApiAdapter);
	private readonly paged = inject(PagedOrderApiAdapter);

	private readonly translateService = inject(TranslateService);
	private readonly ngxLogger = inject(NGXLogger);
	private readonly pushBoxService = inject(PushBoxService);

	/**
	 * Init default from cache
	 * @param ctx
	 * @constructor
	 */
	public async init(
		ctx: StateContext<IBaseState<IOrderDto>>
	) {
		ctx.setState(structuredClone(defaults));
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
	public async closeFormAction(ctx: StateContext<IOrderState>) {

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

	@Action(OrderActions.UpdateFilters)
	private updateFiltersAction(ctx: StateContext<IOrderState>, action: OrderActions.UpdateFilters) {

		const state = ctx.getState();

		this.updateTableStateAction(ctx, {
			payload: {
				...state.tableState,
				filters: action.payload
			}
		});

	}

	@Action(OrderActions.UpdateTableState)
	private updateTableStateAction(ctx: StateContext<IOrderState>, action: OrderActions.UpdateTableState) {

		const state = ctx.getState();

		if (Reflect.has(action.payload, 'orderBy') && Reflect.has(state.tableState, 'orderDir')) {
			if (state.tableState.orderBy === action.payload.orderBy) {
				action.payload['orderDir'] = state.tableState.orderDir === OrderDirEnum.ASC ? OrderDirEnum.DESC : OrderDirEnum.ASC;
			}
		}

		const newTableState = TableState.fromCache({
			...state.tableState,
			...action.payload
		});

		ctx.patchState({
			tableState: newTableState.toCache()
		});

	}

	@Action(OrderActions.GetItem)
	private async getItemAction(ctx: StateContext<IOrderState>, action: OrderActions.GetItem): Promise<void> {

		await firstValueFrom(ctx.dispatch(new AppActions.PageLoading(true)));

		const data = await this.item.executeAsync(action.payload);

		const item = {
			data,
			downloadedAt: new Date(),
		};

		ctx.patchState({
			item
		});

		await firstValueFrom(ctx.dispatch(new AppActions.PageLoading(false)));

	}

	@Action(OrderActions.CreateItem)
	private async createItemAction(ctx: StateContext<IOrderState>, action: OrderActions.CreateItem): Promise<void> {

		ctx.dispatch(new AppActions.PageLoading(true));

		try {
			const data = await this.create.executeAsync(action.payload);

			// Set new/updated item to store state and clear table
			ctx.patchState({
				item: {
					data,
					downloadedAt: new Date(),
				},
			});

			await this.getListAction(ctx, {
				payload: {
					resetPage: false,
					resetParams: false
				}
			});

		} catch (e) {
			this.ngxLogger.error('Error Response: ', e)
		}

		ctx.dispatch(new AppActions.PageLoading(false));

		await this.closeFormAction(ctx);
	}

	@Action(OrderActions.UpdateItem)
	private async updateItemAction(ctx: StateContext<IOrderState>, action: OrderActions.UpdateItem): Promise<void> {

		ctx.dispatch(new AppActions.PageLoading(true));

		try {

			const {payload} = action;
			const {_id} = payload;

			const data = await this.update.executeAsync(_id, payload);

			// Set new/updated item to store state and clear table
			ctx.patchState({
				item: {
					data,
					downloadedAt: new Date(),
				}
			});
			await this.getListAction(ctx, {
				payload: {
					resetPage: false,
					resetParams: false
				}
			});
		} catch (e) {
			this.ngxLogger.error(e);
		}

		ctx.dispatch(new AppActions.PageLoading(false));

		await this.closeFormAction(ctx);
		const {data} = ctx.getState().item;
		data && await this.updateOpenedDetailsAction(ctx, {payload: data});
	}

	@Action(OrderActions.DeleteItem)
	private async deleteItemAction(ctx: StateContext<IOrderState>, action: OrderActions.DeleteItem) {

		await firstValueFrom(ctx.dispatch(new AppActions.PageLoading(true)));

		const isOk = await this.delete.executeAsync(action.payload).then((result) => {
			this.ngxLogger.debug('Delete result: ', result);
			return true;
		}).catch((error) => {
			// Cancel action or there some error
			this.ngxLogger.error(error);
			return false;
		});

		await firstValueFrom(ctx.dispatch(new AppActions.PageLoading(false)));

		if (isOk) {

			ctx.patchState({
				item: {
					data: undefined,
					downloadedAt: new Date(),
				}
			});

		}

		await this.getListAction(ctx, {
			payload: {
				resetPage: false,
				resetParams: false
			}
		});

		await this.closeDetailsAction(ctx, action);
	}

	@Action(OrderActions.GetList)
	private async getListAction(ctx: StateContext<IOrderState>, {
		payload: {
			resetPage,
			resetParams
		}
	}: OrderActions.GetList): Promise<void> {

		await firstValueFrom(ctx.dispatch(new AppActions.PageLoading(true)));

		const state = ctx.getState();

		try {

			const newTableState = TableState.fromCache(state.tableState);

			if (resetPage) {
				newTableState.setPage(1);
			}

			if (resetParams) {
				newTableState.filters = {};
			}

			const params = newTableState.toBackendFormat();

			// Update current state
			const {items, totalSize} = await this.paged.executeAsync(params);

			newTableState
				.setTotal(totalSize)
				.setItems(items)
				.setMaxPage(getMaxPage(newTableState.total, newTableState.pageSize));

			ctx.patchState({
				...state,
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

}
