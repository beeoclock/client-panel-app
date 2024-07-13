import {inject, Injectable} from "@angular/core";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import {OrderByEnum, OrderDirEnum} from "@utility/domain/enum";
import {PagedOrderApiAdapter} from "@order/external/adapter/api/paged.order.api.adapter";
import {IOrderDto} from "@order/external/interface/details/i.order.dto";
import {OrderActions} from "@order/state/order/order.actions";
import {ITableState, TableState} from "@utility/domain/table.state";

export type IOrderState = {
	tableState: ITableState<IOrderDto>;
};

@State<IOrderState>({
	name: 'peerCustomerOrderState',
	defaults: {
		tableState: new TableState<IOrderDto>().setOrderBy(OrderByEnum.UPDATED_AT).setOrderDir(OrderDirEnum.DESC).toCache(),
	}
})
@Injectable()
export class PeerCustomerOrderState {

	protected override readonly paged = inject(PagedOrderApiAdapter);

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
