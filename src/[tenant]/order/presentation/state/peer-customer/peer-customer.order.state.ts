import {inject, Injectable} from "@angular/core";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {ITableState, TableState} from "@utility/domain/table.state";
import {PeerCustomerOrderActions} from "@[tenant]/order/presentation/state/peer-customer/peer-customer.order.actions";
import {getMaxPage} from "@utility/domain/max-page";
import {NGXLogger} from "ngx-logger";
import {StateEnum} from "@core/shared/enum/state.enum";
import EOrder from "@core/business-logic/order/entity/e.order";
import {SharedUow} from "@core/shared/uow/shared.uow";

export type IPeerCustomerOrderState = {
	tableState: ITableState<EOrder>;
	loading: boolean;
};

@State<IPeerCustomerOrderState>({
	name: 'peerCustomerOrderState',
	defaults: {
		tableState: new TableState<EOrder>()
			.setOrderBy(OrderByEnum.CREATED_AT)
			.setOrderDir(OrderDirEnum.DESC)
			.toCache(),
		loading: false,
	}
})
@Injectable()
export class PeerCustomerOrderState {

	private readonly ngxLogger = inject(NGXLogger);
	private readonly sharedUow = inject(SharedUow);

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
				// queryParams,
			}
		}: PeerCustomerOrderActions.GetList
	): Promise<void> {

		ctx.patchState({
			loading: true
		});

		const state = ctx.getState();

		try {

			const newTableState = TableState.fromCache<EOrder>(state.tableState);

			if (resetPage) {
				newTableState.setPage(1);
			}

			if (resetParams) {
				newTableState.filters = {};
			}

			const params = newTableState.toBackendFormat();

			const isState = [StateEnum.active, StateEnum.archived, StateEnum.inactive];

			const result = await this.sharedUow.order.db.filter((order) => {
				if (!isState.includes(order.state)) {
					return false;
				}
				const hasFindCustomer = order.services.some((service) => {
					return service.orderAppointmentDetails.attendees.some((attendee) => {
						return attendee.customer._id === params.customerId;
					});
				});
				return hasFindCustomer;
			}).toArray();

			const items = result.map(EOrder.fromRaw);

			newTableState
				.setTotal(result.length)
				.setItems(items)
				.setMaxPage(getMaxPage(newTableState.total, newTableState.pageSize));

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
