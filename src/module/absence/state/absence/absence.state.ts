import {inject, Injectable} from "@angular/core";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import {baseDefaults, IBaseState} from "@utility/state/base/base.state";
import {OrderByEnum, OrderDirEnum} from "@utility/domain/enum";
import {TranslateService} from "@ngx-translate/core";
import {AbsenceActions} from "@module/absence/state/absence/absence.actions";
import {IAbsenceDto} from "@module/absence/external/interface/i.absence.dto";
import {CreateAbsenceApiAdapter} from "@module/absence/external/adapter/api/create.order.api.adapter";
import {UpdateAbsenceApiAdapter} from "@module/absence/external/adapter/api/update.order.api.adapter";
import {DetailsAbsenceApiAdapter} from "@module/absence/external/adapter/api/details.order.api.adapter";
import {PagedAbsenceApiAdapter} from "@module/absence/external/adapter/api/paged.order.api.adapter";
import {DeleteAbsenceApiAdapter} from "@module/absence/external/adapter/api/delete.order.api.adapter";
import {AppActions} from "@utility/state/app/app.actions";
import {NGXLogger} from "ngx-logger";
import {PushBoxService} from "@utility/presentation/component/push-box/push-box.service";
import {firstValueFrom} from "rxjs";
import {TableState} from "@utility/domain/table.state";
import {getMaxPage} from "@utility/domain/max-page";

export type IAbsenceState = IBaseState<IAbsenceDto>;

const defaults = baseDefaults<IAbsenceDto>({
	filters: {},
	orderBy: OrderByEnum.CREATED_AT,
	orderDir: OrderDirEnum.DESC,
});

@State<IAbsenceState>({
	name: 'absence',
	defaults,
})
@Injectable()
export class AbsenceState {

	private readonly create = inject(CreateAbsenceApiAdapter);
	private readonly update = inject(UpdateAbsenceApiAdapter);
	private readonly item = inject(DetailsAbsenceApiAdapter);
	private readonly delete = inject(DeleteAbsenceApiAdapter);
	private readonly list = inject(PagedAbsenceApiAdapter);

	private readonly translateService = inject(TranslateService);
	private readonly ngxLogger = inject(NGXLogger);
	private readonly pushBoxService = inject(PushBoxService);

	/**
	 * Init default from cache
	 * @param ctx
	 * @constructor
	 */
	public async init(
		ctx: StateContext<IBaseState<IAbsenceDto>>
	) {
		ctx.setState(structuredClone(defaults));
	}

	// Application layer

	@Action(AbsenceActions.CloseDetails)
	public async closeDetailsAction(ctx: StateContext<IAbsenceState>, action?: AbsenceActions.CloseDetails) {

		const {AbsenceDetailsContainerComponent} = await import("@absence/presentation/component/details/absence-details-container.component");

		if (action?.payload) {
			this.pushBoxService.destroy$.next(AbsenceDetailsContainerComponent.name + '_' + action?.payload);
			return;
		}

		this.pushBoxService.destroyByComponentName$.next(AbsenceDetailsContainerComponent.name);

	}

	@Action(AbsenceActions.CloseForm)
	public async closeFormAction(ctx: StateContext<IAbsenceState>) {

		const {AbsenceFormContainerComponent} = await import("@absence/presentation/component/form/absence-form-container.component");

		this.pushBoxService.destroyByComponentName$.next(AbsenceFormContainerComponent.name);

	}

	@Action(AbsenceActions.UpdateOpenedDetails)
	public async updateOpenedDetailsAction(ctx: StateContext<IAbsenceState>, {payload}: AbsenceActions.UpdateOpenedDetails) {

		const {AbsenceDetailsContainerComponent} = await import("@absence/presentation/component/details/absence-details-container.component");

		await this.pushBoxService.updatePushBoxComponentAsync({
			id: payload._id,
			useComponentNameAsPrefixOfId: true,
			component: AbsenceDetailsContainerComponent,
			componentInputs: {item: payload},
		});

	}

	@Action(AbsenceActions.OpenDetailsById)
	public async openDetailsByIdAction(ctx: StateContext<IAbsenceState>, {payload: id}: AbsenceActions.OpenDetailsById) {

		const title = await this.translateService.instant('absence.details.title');

		const {AbsenceDetailsContainerComponent} = await import("@absence/presentation/component/details/absence-details-container.component");

		await this.pushBoxService.buildItAsync({
			id,
			title,
			showLoading: true,
			useComponentNameAsPrefixOfId: true,
			component: AbsenceDetailsContainerComponent,
		});

		const item = await this.item.executeAsync(id);

		await this.pushBoxService.updatePushBoxComponentAsync({
			id,
			useComponentNameAsPrefixOfId: true,
			component: AbsenceDetailsContainerComponent,
			componentInputs: {item},
		});

	}

	@Action(AbsenceActions.OpenFormToEditById)
	public async openFormToEditByIdAction(ctx: StateContext<IAbsenceState>, action: AbsenceActions.OpenFormToEditById) {

		const title = await this.translateService.instant('absence.form.title.edit');

		const {UpdateAbsenceFormContainerComponent} = await import("@absence/presentation/component/form/update/update.absence-form-container.component");

		await this.pushBoxService.buildItAsync({
			title,
			id: action.payload,
			component: UpdateAbsenceFormContainerComponent,
			componentInputs: {},
		});

		const item = await this.item.executeAsync(action.payload);

		await this.pushBoxService.buildItAsync({
			title,
			id: action.payload,
			component: UpdateAbsenceFormContainerComponent,
			componentInputs: {
				item,
				isEditMode: true,
			},
		});

	}

	@Action(AbsenceActions.OpenForm)
	public async openFormAction(ctx: StateContext<IAbsenceState>, {payload}: AbsenceActions.OpenForm): Promise<void> {

		const {CreateAbsenceFormContainerComponent} = await import("@absence/presentation/component/form/create/create.absence-form-container.component");

		const {componentInputs, pushBoxInputs} = payload ?? {};

		await this.pushBoxService.buildItAsync({
			id: CreateAbsenceFormContainerComponent.name,
			title: this.translateService.instant('absence.form.title.create'),
			...pushBoxInputs,
			component: CreateAbsenceFormContainerComponent,
			componentInputs,
		});

	}

	// API

	@Action(AbsenceActions.UpdateFilters)
	private updateFiltersAction(ctx: StateContext<IAbsenceState>, action: AbsenceActions.UpdateFilters) {

		const state = ctx.getState();

		this.updateTableStateAction(ctx, {
			payload: {
				...state.tableState,
				filters: action.payload
			}
		});

	}

	@Action(AbsenceActions.UpdateTableState)
	private updateTableStateAction(ctx: StateContext<IAbsenceState>, action: AbsenceActions.UpdateTableState) {

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

	@Action(AbsenceActions.GetItem)
	private async getItemAction(ctx: StateContext<IAbsenceState>, action: AbsenceActions.GetItem): Promise<void> {

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

	@Action(AbsenceActions.CreateItem)
	private async createItemAction(ctx: StateContext<IAbsenceState>, action: AbsenceActions.CreateItem): Promise<void> {

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

	@Action(AbsenceActions.UpdateItem)
	private async updateItemAction(ctx: StateContext<IAbsenceState>, action: AbsenceActions.UpdateItem): Promise<void> {

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

	@Action(AbsenceActions.DeleteItem)
	private async deleteItemAction(ctx: StateContext<IAbsenceState>, action: AbsenceActions.DeleteItem) {

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

	@Action(AbsenceActions.GetList)
	private async getListAction(ctx: StateContext<IAbsenceState>, {
		payload: {
			resetPage,
			resetParams
		}
	}: AbsenceActions.GetList): Promise<void> {

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
			const {items, totalSize} = await this.list.executeAsync(params);

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
	public static itemData(state: IAbsenceState) {
		return state.item.data;
	}

	@Selector()
	public static tableStateItems(state: IAbsenceState) {
		return state.tableState.items;
	}

	@Selector()
	public static tableState(state: IAbsenceState) {
		return state.tableState;
	}

	@Selector()
	public static tableStateFilters(state: IAbsenceState) {
		return state.tableState.filters;
	}

}
