import {inject, Injectable} from "@angular/core";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import {OrderByEnum, OrderDirEnum} from "@utility/domain/enum";
import {PagedOrderApiAdapter} from "@order/external/adapter/api/paged.order.api.adapter";
import {IOrderDto} from "@order/external/interface/details/i.order.dto";
import {ITableState, TableState} from "@utility/domain/table.state";
import {PeerCustomerOrderActions} from "@order/state/peer-customer/peer-customer.order.actions";
import {getMaxPage} from "@utility/domain/max-page";
import {NGXLogger} from "ngx-logger";

export type IPeerCustomerOrderState = {
	tableState: ITableState<IOrderDto>;
	loading: boolean;
};

@State<IPeerCustomerOrderState>({
	name: 'peerCustomerOrderState',
	defaults: {
		tableState: new TableState<IOrderDto>()
			.setOrderBy(OrderByEnum.UPDATED_AT)
			.setOrderDir(OrderDirEnum.DESC)
			.toCache(),
		loading: false,
	}
})
@Injectable()
export class PeerCustomerOrderState {

	private readonly paged = inject(PagedOrderApiAdapter);
	private readonly ngxLogger = inject(NGXLogger);

	@Action(PeerCustomerOrderActions.UpdateFilters)
	public updateFilters(
		ctx: StateContext<IPeerCustomerOrderState>,
		action: PeerCustomerOrderActions.UpdateFilters
	) {
		ctx.patchState({
			tableState: TableState.fromCache(
				ctx.getState().tableState
			).setFilters(action.payload).toCache(),
		});
	}

	@Action(PeerCustomerOrderActions.UpdateTableState)
	public updateTableState(
		ctx: StateContext<IPeerCustomerOrderState>,
		action: PeerCustomerOrderActions.UpdateTableState
	) {
		ctx.patchState({
			tableState: TableState.fromCache(
				action.payload
			).toCache(),
		});
	}

	@Action(PeerCustomerOrderActions.PatchTableState)
	public patchTableState(
		ctx: StateContext<IPeerCustomerOrderState>,
		action: PeerCustomerOrderActions.PatchTableState
	) {
		ctx.patchState({
			tableState: TableState.fromCache({
				...ctx.getState().tableState,
				...action.payload
			}).toCache(),
		});
	}


	@Action(PeerCustomerOrderActions.GetList)
	public async getList(
		ctx: StateContext<IPeerCustomerOrderState>, {
			payload: {
				resetPage,
				resetParams,
				queryParams,
			}
		}: PeerCustomerOrderActions.GetList
	): Promise<void> {

		ctx.patchState({
			loading: true
		});

		const state = ctx.getState();

		try {

			const newTableState = TableState.fromCache<IOrderDto>(state.tableState);

			if (resetPage) {
				newTableState.setPage(1);
			}

			if (resetParams) {
				newTableState.filters = {};
			}

			const params = newTableState.toBackendFormat();

			// Update current state
			const {items, totalSize} = await this.paged.executeAsync({
				...params,
				...(queryParams ?? {})
			});

			newTableState
				.setTotal(totalSize)
				.setItems(items)
				.setMaxPage(getMaxPage(newTableState.total, newTableState.pageSize));

			this.ngxLogger.debug('Table state: ', newTableState);

			ctx.patchState({
				...state,
				tableState: newTableState.toCache(),
			});

		} catch (e) {
			this.ngxLogger.error(e);
		}

		// Switch of page loader
		ctx.patchState({
			loading: false
		});

	}

	// Selectors

	@Selector()
	public static tableStateItems(state: IPeerCustomerOrderState) {
		return state.tableState.items;
	}

	@Selector()
	public static tableState(state: IPeerCustomerOrderState) {
		return state.tableState;
	}

	@Selector()
	public static tableStateFilters(state: IPeerCustomerOrderState) {
		return state.tableState.filters;
	}

	@Selector()
	public static loading(state: IPeerCustomerOrderState) {
		return state.loading;
	}

}
