import {inject, Injectable, reflectComponentType} from "@angular/core";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import {baseDefaults, BaseState, IBaseState} from "@utility/state/base/base.state";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {TranslateService} from "@ngx-translate/core";
import {AbsenceActions} from "@absence/infrastructure/state/absence/absence.actions";
import {WhacAMoleProvider} from "@utility/presentation/whac-a-mole/whac-a-mole.provider";
import {NGXLogger} from "ngx-logger";
import {firstValueFrom} from "rxjs";
import {AppActions} from "@utility/state/app/app.actions";
import {TableState} from "@utility/domain/table.state";
import {getMaxPage} from "@utility/domain/max-page";
import {StateEnum} from "@core/shared/enum/state.enum";
import {environment} from "@environment/environment";
import EAbsence from "@core/business-logic/absence/entity/e.absence";
import {SharedUow} from "@core/shared/uow/shared.uow";

export type IAbsenceState = IBaseState<EAbsence>;

const defaults = baseDefaults<EAbsence>({
	filters: {},
	orderBy: OrderByEnum.CREATED_AT,
	orderDir: OrderDirEnum.DESC,
	pageSize: environment.config.pagination.pageSize,
});

@State<IAbsenceState>({
	name: 'absence',
	defaults,
})
@Injectable()
export class AbsenceState {


	private readonly whacAMaleProvider = inject(WhacAMoleProvider);
	private readonly translateService = inject(TranslateService);
	private readonly ngxLogger = inject(NGXLogger);
	private readonly sharedUow = inject(SharedUow);

	// Application layer

	@Action(AbsenceActions.CloseDetails)
	public async closeDetailsAction() {

		const {AbsenceDetailsContainerComponent} = await import("@absence/presentation/component/details/absence-details-container.component");

		await this.whacAMaleProvider.destroyComponent(AbsenceDetailsContainerComponent);

	}

	@Action(AbsenceActions.CloseForm)
	public async closeFormAction() {

		const {AbsenceFormContainerComponent} = await import("@absence/presentation/component/form/absence-form-container.component");

		await this.whacAMaleProvider.destroyComponent(AbsenceFormContainerComponent);

	}

	@Action(AbsenceActions.UpdateOpenedDetails)
	public async updateOpenedDetailsAction(ctx: StateContext<IAbsenceState>, {payload}: AbsenceActions.UpdateOpenedDetails) {

		import("@absence/presentation/component/details/absence-details-container.component")
			.then(({AbsenceDetailsContainerComponent}) => {

				this.ngxLogger.debug('AbsenceState.updateOpenedDetails', 'payload', payload);

				const componentMirror = reflectComponentType(AbsenceDetailsContainerComponent);

				if (!componentMirror) {
					this.ngxLogger.error('AbsenceState.updateOpenedDetails', 'value of `component` property is not a component');
					return;
				}

				const componentRefList = this.whacAMaleProvider.componentRefMapByComponentName.get(componentMirror.selector);

				if (!componentRefList?.length) {
					this.ngxLogger.debug('AbsenceState.updateOpenedDetails Did not find', componentMirror.selector, this);
					return;
				}

				const {0: componentRef} = componentRefList;

				const {renderedComponentRef} = componentRef.instance;

				if (!renderedComponentRef) {
					this.ngxLogger.error('AbsenceState.updateOpenedDetails', 'renderedComponentRef is not defined');
					return;
				}

				if ('item' in renderedComponentRef.instance) {
					const {_id} = renderedComponentRef.instance.item;
					if (_id === payload._id) {
						renderedComponentRef.setInput('item', payload);
						renderedComponentRef.changeDetectorRef.detectChanges();
						this.ngxLogger.debug('AbsenceState.updateOpenedDetails', 'Item updated');
						return;
					}
					this.ngxLogger.error('AbsenceState.updateOpenedDetails', 'Item not found');
				}

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

		const item = await this.sharedUow.absence.repository.findByIdAsync(id);

		if (!item) {
			this.ngxLogger.error('AbsenceState.openDetailsById', 'Item not found');
			return;
		}

		const entity = EAbsence.fromRaw(item);

		ctx.dispatch(new AbsenceActions.OpenDetails(entity));

	}

	@Action(AbsenceActions.OpenFormToEditById)
	public async openFormToEditByIdAction(ctx: StateContext<IAbsenceState>, action: AbsenceActions.OpenFormToEditById) {

		const title = await this.translateService.instant('absence.form.title.edit');
		const item = await this.sharedUow.absence.repository.findByIdAsync(action.payload);

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
		BaseState.updateTableState<EAbsence>(ctx, action);
	}

	@Action(AbsenceActions.CreateItem)
	public async createItem(ctx: StateContext<IAbsenceState>, {payload: entity}: AbsenceActions.CreateItem) {
		await this.sharedUow.absence.repository.createAsync(entity);
		await this.closeFormAction();
		ctx.dispatch(new AbsenceActions.GetList());
	}

	@Action(AbsenceActions.UpdateItem)
	public async updateItem(ctx: StateContext<IAbsenceState>, {payload: item}: AbsenceActions.UpdateItem): Promise<void> {
		const foundItem = await this.sharedUow.absence.repository.findByIdAsync(item._id);
		if (foundItem) {
			const entity = EAbsence.fromRaw({
				...foundItem,
				...item,
			});
			await this.sharedUow.absence.repository.updateAsync(entity);
			await this.closeFormAction();
			await this.updateOpenedDetailsAction(ctx, {payload: entity});
			ctx.dispatch(new AbsenceActions.GetList());
		}
	}

	@Action(AbsenceActions.GetItem)
	public async getItem(ctx: StateContext<IAbsenceState>, action: AbsenceActions.GetItem): Promise<void> {
		const data = await this.sharedUow.absence.repository.findByIdAsync(action.payload);

		if (!data) {
			return;
		}

		const entity = EAbsence.fromRaw(data);

		ctx.patchState({
			item: {
				data: entity,
				downloadedAt: new Date(),
			}
		});
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

			const params = newTableState.toBackendFormat();

			const inState = (
				params?.state ?
					[params.state] :
					[StateEnum.active, StateEnum.archived, StateEnum.inactive]
			);

			const {items, totalSize} = await this.sharedUow.absence.repository.findAsync({
				...params,
				state: inState,
			});

			const entities = items.map(EAbsence.fromRaw);

			newTableState
				.setTotal(totalSize)
				.setItems(entities)
				.setMaxPage(getMaxPage(newTableState.total, newTableState.pageSize));

			this.ngxLogger.debug('Table state: ', newTableState);

			ctx.patchState({
				tableState: newTableState.toCache(),
				lastTableHashSum: newTableState.hashSum,
			});

		} catch (e) {
			this.ngxLogger.error(e);
		}

		// Switch of page loader
		await firstValueFrom(ctx.dispatch(new AppActions.PageLoading(false)));
	}

	@Action(AbsenceActions.SetState)
	public async setState(ctx: StateContext<IAbsenceState>, {item, state}: AbsenceActions.SetState) {
		const foundItems = await this.sharedUow.absence.repository.findByIdAsync(item._id);
		if (foundItems) {
			const entity = EAbsence.fromRaw(foundItems);
			entity.changeState(state);
			await this.sharedUow.absence.repository.updateAsync(entity);
			await this.updateOpenedDetailsAction(ctx, {payload: entity});
			ctx.dispatch(new AbsenceActions.GetList());
		}
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
