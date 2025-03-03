import {inject, Injectable} from "@angular/core";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import {baseDefaults, IBaseState} from "@utility/state/base/base.state";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {NGXLogger} from "ngx-logger";
import {firstValueFrom} from "rxjs";
import {AppActions} from "@utility/state/app/app.actions";
import {TableState} from "@utility/domain/table.state";
import {getMaxPage} from "@utility/domain/max-page";
import {StateEnum} from "@core/shared/enum/state.enum";
import {environment} from "@environment/environment";
import {SharedUow} from "@core/shared/uow/shared.uow";
import ETariffPlan from "@core/business-logic/tariif-plan/entity/e.tariff-plan";
import {TariffPlanActions} from "@tariffPlan/infrastructure/state/absence/tariff-plan.actions";

export type ITariffPlanState = IBaseState<ETariffPlan>;

const defaults = baseDefaults<ETariffPlan>({
	filters: {},
	orderBy: OrderByEnum.CREATED_AT,
	orderDir: OrderDirEnum.DESC,
	pageSize: environment.config.pagination.pageSize,
});

@State<ITariffPlanState>({
	name: 'tariffPlan',
	defaults,
})
@Injectable()
export class TariffPlanState {

	private readonly ngxLogger = inject(NGXLogger);
	private readonly sharedUow = inject(SharedUow);

	// API

	@Action(TariffPlanActions.Init)
	public async init(ctx: StateContext<ITariffPlanState>): Promise<void> {
		ctx.setState(structuredClone(defaults));
	}

	@Action(TariffPlanActions.GetItem)
	public async getItem(ctx: StateContext<ITariffPlanState>, action: TariffPlanActions.GetItem): Promise<void> {
		const data = await this.sharedUow.tariffPlan.repository.findByIdAsync(action.payload);

		if (!data) {
			return;
		}

		const entity = ETariffPlan.fromRaw(data);

		ctx.patchState({
			item: {
				data: entity,
				downloadedAt: new Date(),
			}
		});
	}

	@Action(TariffPlanActions.GetList)
	public async getList(ctx: StateContext<ITariffPlanState>, action: TariffPlanActions.GetList): Promise<void> {

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

			const {items, totalSize} = await this.sharedUow.tariffPlan.repository.findAsync({
				...params,
				state: inState,
			});

			const entities = items.map(ETariffPlan.fromRaw);

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

	// Selectors

	@Selector()
	public static itemData(state: ITariffPlanState) {
		return state.item.data;
	}

	@Selector()
	public static tableStateItems(state: ITariffPlanState) {
		return state.tableState.items;
	}

	@Selector()
	public static tableState(state: ITariffPlanState) {
		const {tableState} = state;
		return tableState;
	}

	@Selector()
	public static tableStateFilters(state: ITariffPlanState) {
		return state.tableState.filters;
	}

}
