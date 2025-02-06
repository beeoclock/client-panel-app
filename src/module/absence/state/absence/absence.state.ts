import {inject, Injectable} from "@angular/core";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import {baseDefaults, BaseState, IBaseState} from "@utility/state/base/base.state";
import {OrderByEnum, OrderDirEnum} from "@utility/domain/enum";
import {TranslateService} from "@ngx-translate/core";
import {AbsenceActions} from "@module/absence/state/absence/absence.actions";
import {IAbsence} from "@absence/domain/interface/i.absence";
import {WhacAMoleProvider} from "@utility/presentation/whac-a-mole/whac-a-mole.provider";
import {NGXLogger} from "ngx-logger";
import {AbsenceIndexedDBFacade} from "@absence/infrastructure/facade/indexedDB/absence.indexedDB.facade";
import {firstValueFrom} from "rxjs";
import {AppActions} from "@utility/state/app/app.actions";
import {TableState} from "@utility/domain/table.state";
import {getMaxPage} from "@utility/domain/max-page";
import {StateEnum} from "@utility/domain/enum/state.enum";
import EAbsence from "@absence/domain/entity/e.absence";

export type IAbsenceState = IBaseState<IAbsence.DTO>;

const defaults = baseDefaults<IAbsence.DTO>({
	filters: {},
	orderBy: OrderByEnum.CREATED_AT,
	orderDir: OrderDirEnum.DESC,
	pageSize: 20
});

@State<IAbsenceState>({
	name: 'absence',
	defaults,
})
@Injectable()
export class AbsenceState {

	public readonly absenceIndexedDBFacade = inject(AbsenceIndexedDBFacade);

	private readonly whacAMaleProvider = inject(WhacAMoleProvider);
	private readonly translateService = inject(TranslateService);
	private readonly ngxLogger = inject(NGXLogger);

	// Application layer

	@Action(AbsenceActions.CloseDetails)
	public async closeDetailsAction(ctx: StateContext<IAbsenceState>, action?: AbsenceActions.CloseDetails) {

		const {AbsenceDetailsContainerComponent} = await import("@absence/presentation/component/details/absence-details-container.component");

		await this.whacAMaleProvider.destroyComponent(AbsenceDetailsContainerComponent);

	}

	@Action(AbsenceActions.CloseForm)
	public async closeFormAction(ctx: StateContext<IAbsenceState>, action?: AbsenceActions.CloseForm) {

		const {AbsenceFormContainerComponent} = await import("@absence/presentation/component/form/absence-form-container.component");

		await this.whacAMaleProvider.destroyComponent(AbsenceFormContainerComponent);

	}

	@Action(AbsenceActions.UpdateOpenedDetails)
	public async updateOpenedDetailsAction(ctx: StateContext<IAbsenceState>, {payload}: AbsenceActions.UpdateOpenedDetails) {

		const {AbsenceDetailsContainerComponent} = await import("@absence/presentation/component/details/absence-details-container.component");

		await this.whacAMaleProvider.updateWhacAMoleComponentAsync({
			component: AbsenceDetailsContainerComponent,
			componentInputs: {item: payload},
		});

	}

	@Action(AbsenceActions.OpenDetails)
	public async openDetailsAction(ctx: StateContext<IAbsenceState>, {payload}: AbsenceActions.OpenDetails) {

		const title = await this.translateService.instant('absence.details.title');

		const {AbsenceDetailsContainerComponent} = await import("@absence/presentation/component/details/absence-details-container.component");

		await this.whacAMaleProvider.buildItAsync({
			title,
			component: AbsenceDetailsContainerComponent,
			componentInputs: {
				item: payload
			},
		});

	}

	@Action(AbsenceActions.OpenDetailsById)
	public async openDetailsByIdAction(ctx: StateContext<IAbsenceState>, {payload: id}: AbsenceActions.OpenDetailsById) {

		const title = await this.translateService.instant('absence.details.title');
		const item = this.absenceIndexedDBFacade.source.findOne({
			id
		});

		if (!item) {
			this.ngxLogger.error('AbsenceState.openDetailsById', 'Item not found');
			return;
		}


		const {AbsenceDetailsContainerComponent} = await import("@absence/presentation/component/details/absence-details-container.component");

		await this.whacAMaleProvider.buildItAsync({
			title,
			showLoading: true,
			component: AbsenceDetailsContainerComponent,
			componentInputs: {item},
		});

	}

	@Action(AbsenceActions.OpenFormToEditById)
	public async openFormToEditByIdAction(ctx: StateContext<IAbsenceState>, action: AbsenceActions.OpenFormToEditById) {

		const title = await this.translateService.instant('absence.form.title.edit');
		const item = this.absenceIndexedDBFacade.source.findOne({
			id: action.payload
		});

		if (!item) {
			this.ngxLogger.error('AbsenceState.openDetailsById', 'Item not found');
			return;
		}


		const {AbsenceFormContainerComponent} = await import("@absence/presentation/component/form/absence-form-container.component");

		await this.whacAMaleProvider.buildItAsync({
			title,
			component: AbsenceFormContainerComponent,
			componentInputs: {
				item,
				isEditMode: true,
			},
		});

	}

	@Action(AbsenceActions.OpenForm)
	public async openFormAction(ctx: StateContext<IAbsenceState>, {payload}: AbsenceActions.OpenForm): Promise<void> {

		const {AbsenceFormContainerComponent} = await import("@absence/presentation/component/form/absence-form-container.component");

		const {componentInputs, pushBoxInputs} = payload ?? {};

		await this.whacAMaleProvider.buildItAsync({
			title: this.translateService.instant('absence.form.title.create'),
			...(pushBoxInputs ?? {}),
			component: AbsenceFormContainerComponent,
			componentInputs,
		});

	}

	// API

	@Action(AbsenceActions.Init)
	public async init(ctx: StateContext<IAbsenceState>): Promise<void> {
		ctx.setState(structuredClone(defaults));
	}

	@Action(AbsenceActions.UpdateFilters)
	public updateFilters(ctx: StateContext<IAbsenceState>, action: AbsenceActions.UpdateFilters) {

		BaseState.updateFilters(ctx, action);
	}

	@Action(AbsenceActions.UpdateTableState)
	public updateTableState(ctx: StateContext<IAbsenceState>, action: AbsenceActions.UpdateTableState) {
		BaseState.updateTableState(ctx, action);
	}

	@Action(AbsenceActions.CreateItem)
	public async createItem(ctx: StateContext<IAbsenceState>, action: AbsenceActions.CreateItem) {
		this.absenceIndexedDBFacade.source.insert(EAbsence.create(action.payload));
		await this.closeFormAction(ctx);
	}

	@Action(AbsenceActions.UpdateItem)
	public async updateItem(ctx: StateContext<IAbsenceState>, action: AbsenceActions.UpdateItem): Promise<void> {

		const item = EAbsence.create(action.payload);
		this.absenceIndexedDBFacade.source.updateOne({
			id: action.payload._id,
		}, {
			$set: item
		});
		await this.closeFormAction(ctx);
		const {data} = ctx.getState().item;
		data && await this.updateOpenedDetailsAction(ctx, {payload: item});
	}

	@Action(AbsenceActions.GetItem)
	public async getItem(ctx: StateContext<IAbsenceState>, action: AbsenceActions.GetItem): Promise<void> {
		const data = this.absenceIndexedDBFacade.source.findOne({
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

	@Action(AbsenceActions.DeleteItem)
	public async deleteItem(ctx: StateContext<IAbsenceState>, action: AbsenceActions.DeleteItem) {
		this.absenceIndexedDBFacade.source.removeOne({
			id: action.payload
		});
		await this.closeDetailsAction(ctx, action);
	}

	@Action(AbsenceActions.GetList)
	public async getList(ctx: StateContext<IAbsenceState>, action: AbsenceActions.GetList): Promise<void> {

		await firstValueFrom(ctx.dispatch(new AppActions.PageLoading(true)));

		const state = ctx.getState();

		try {

			const newTableState = TableState.fromCache(state.tableState);

			const {
				// queryParams,
				resetPage,
				resetParams
			} = action.payload ?? {};

			if (resetPage) {
				newTableState.setPage(1);
			}

			if (resetParams) {
				newTableState.filters = {};
			}

			const phraseFields = ['firstName', 'lastName'];

			const params = newTableState.toBackendFormat();

			const selector = {
				$and: [
					...((newTableState.filters?.phrase as string)?.length ? [{
						$or: phraseFields.map((field) => {
							return {
								[field]: {
									$regex: newTableState.filters.phrase,
									$options: "i"
								}
							}
						})
					}] : []),
					{
						state: {
							$in: [StateEnum.active, StateEnum.archived, StateEnum.inactive]
						}
					}
				]
			};

			const items = this.absenceIndexedDBFacade.source.find(selector, {
				limit: params.pageSize,
				skip: (params.page - 1) * params.pageSize,
				sort: {
					[params.orderBy]: params.orderDir === OrderDirEnum.ASC ? 1 : -1
				}
			}).fetch();

			const count = this.absenceIndexedDBFacade.source.find(selector).count();

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

	@Action(AbsenceActions.ArchiveItem)
	public async archiveItem(ctx: StateContext<IAbsenceState>, action: AbsenceActions.ArchiveItem) {
		const item = this.absenceIndexedDBFacade.source.findOne({
			id: action.payload
		});
		if (!item) {
			this.ngxLogger.error('AbsenceState.archiveItem', 'Item not found');
			return;
		}
		this.absenceIndexedDBFacade.source.updateOne({
				id: action.payload
			},
			{
				$set: {
					status: StateEnum.archived,
					stateHistory: [
						...item.stateHistory,
						{
							state: StateEnum.archived,
							setAt: new Date().toISOString()
						}
					]
				}
			});
		const {data} = ctx.getState().item;
		data && await this.updateOpenedDetailsAction(ctx, {payload: item});
	}

	@Action(AbsenceActions.UnarchiveItem)
	public async unarchiveItem(ctx: StateContext<IAbsenceState>, action: AbsenceActions.UnarchiveItem) {
		const item = this.absenceIndexedDBFacade.source.findOne({
			id: action.payload
		});
		if (!item) {
			this.ngxLogger.error('AbsenceState.unarchiveItem', 'Item not found');
			return;
		}

		this.absenceIndexedDBFacade.source.updateOne({
				id: action.payload
			},
			{
				$set: {
					status: StateEnum.active,
					stateHistory: [
						...item.stateHistory,
						{
							state: StateEnum.active,
							setAt: new Date().toISOString()
						}
					]
				}
			});
		const {data} = ctx.getState().item;
		data && await this.updateOpenedDetailsAction(ctx, {payload: item});
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
		const {tableState} = state;
		return tableState;
	}

	@Selector()
	public static tableStateFilters(state: IAbsenceState) {
		return state.tableState.filters;
	}

}
