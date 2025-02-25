import {StateContext, Store} from "@ngxs/store";
import {BaseActions} from "@utility/state/base/base.actions";
import {ITableState, TableState} from "@utility/domain/table.state";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {inject} from "@angular/core";
import {Router} from "@angular/router";
import {NGXLogger} from "ngx-logger";
import {NgEventBus} from "ng-event-bus";
import {WhacAMoleProvider} from "@utility/presentation/whac-a-mole/whac-a-mole.provider";
import {ABaseEntity} from "@core/system/abstract/a.base-entity";

export interface IBaseState_Item<ITEM> {
	data: undefined | ITEM;
	downloadedAt: Date;
}

export interface IBaseState<ITEM> {
	item: IBaseState_Item<ITEM>;
	tableState: ITableState<ITEM>;
	lastTableHashSum: undefined | string;
}

export function baseDefaults<T>({filters, orderBy, orderDir, pageSize}: {
	filters: { [key: string]: unknown; };
	orderBy: OrderByEnum;
	orderDir: OrderDirEnum;
	pageSize: number;
}): IBaseState<T> {
	return {
		item: {
			data: undefined,
			downloadedAt: new Date(),
		},
		tableState: new TableState<T>().setFilters(filters).setOrderBy(orderBy).setOrderDir(orderDir).setPageSize(pageSize).toCache(),
		lastTableHashSum: undefined,
	};
}

export abstract class BaseState<ITEM extends ABaseEntity> {

	protected readonly ngEventBus = inject(NgEventBus);

	protected readonly router = inject(Router);
	protected readonly store = inject(Store);
	protected readonly ngxLogger = inject(NGXLogger);
	protected readonly whacAMaleProvider = inject(WhacAMoleProvider);

	protected constructor(
		protected defaults: IBaseState<ITEM>,
	) {
	}

	/**
	 * Init default from cache
	 * @param ctx
	 * @constructor
	 */
	public async init(
		ctx: StateContext<IBaseState<ITEM>>
	) {
		ctx.setState(structuredClone(this.defaults));
	}

	/**
	 *
	 * @param ctx
	 * @param payload
	 */
	public static updateFilters<ITEM>(ctx: StateContext<IBaseState<ITEM>>, {payload}: BaseActions.UpdateFilters) {

		const state = ctx.getState();

		this.updateTableState(ctx, {
			payload: {
				...state.tableState,
				filters: payload
			}
		});

	}

	/**
	 *
	 * @param ctx
	 * @param payload
	 */
	public static updateTableState<ITEM>(ctx: StateContext<IBaseState<ITEM>>, {payload}: BaseActions.UpdateTableState<ITEM>) {

		const state = ctx.getState();

		const {tableState} = state;

		if (Reflect.has(payload, 'orderBy') && Reflect.has(tableState, 'orderDir')) {
			if (tableState.orderBy === payload.orderBy) {
				payload['orderDir'] = tableState.orderDir === OrderDirEnum.ASC ? OrderDirEnum.DESC : OrderDirEnum.ASC;
			}
		}

		// If phrase is exist then page should be reset
		if (payload.filters && 'phrase' in payload.filters && payload.filters.phrase) {
			payload['page'] = 1;
		}

		// Is tableState has phrase and payload has not then reset page
		if ('phrase' in tableState.filters && !(payload.filters && 'phrase' in payload.filters)) {
			payload['page'] = 1;
		}

		const newTableState = TableState.fromCache({
			...state.tableState,
			...payload,
			items: []
		});

		ctx.patchState({
			tableState: newTableState.toCache()
		});

	}


}
