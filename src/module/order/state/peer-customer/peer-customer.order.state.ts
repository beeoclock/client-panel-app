import {inject, Injectable} from "@angular/core";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import {OrderByEnum, OrderDirEnum} from "@utility/domain/enum";
import {PagedOrderApiAdapter} from "@order/external/adapter/api/paged.order.api.adapter";
import {IOrderDto} from "@order/external/interface/details/i.order.dto";
import {ITableState, TableState} from "@utility/domain/table.state";
import {BaseState} from "@utility/state/base/base.state";
import {PeerCustomerOrderActions} from "@order/state/peer-customer/peer-customer.order.actions";

export type IPeerCustomerOrderState = {
	tableState: ITableState<IOrderDto>;
};

@State<IPeerCustomerOrderState>({
	name: 'peerCustomerOrderState',
	defaults: {
		tableState: new TableState<IOrderDto>().setOrderBy(OrderByEnum.UPDATED_AT).setOrderDir(OrderDirEnum.DESC).toCache(),
	}
})
@Injectable()
export class PeerCustomerOrderState {

	private readonly paged = inject(PagedOrderApiAdapter);

	@Action(PeerCustomerOrderActions.UpdateFilters)
	public updateFilters(ctx: StateContext<IPeerCustomerOrderState>, action: PeerCustomerOrderActions.UpdateFilters) {
		BaseState.updateFilters(ctx, action);
	}

	@Action(PeerCustomerOrderActions.UpdateTableState)
	public updateTableState(ctx: StateContext<IPeerCustomerOrderState>, action: PeerCustomerOrderActions.UpdateTableState) {
		BaseState.updateTableState(ctx, action);
	}

	//
	// @Action(PeerCustomerOrderActions.GetList)
	// public async getList(ctx: StateContext<IPeerCustomerOrderState>, action: PeerCustomerOrderActions.GetList): Promise<void> {
	// 	await super.getList(ctx, action);
	// }

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

}
