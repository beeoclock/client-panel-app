import {StateContext, Store} from "@ngxs/store";
import {BaseActions} from "@utility/state/base/base.actions";
import {AppActions} from "@utility/state/app/app.actions";
import {ITableState, TableState} from "@utility/domain/table.state";
import {firstValueFrom} from "rxjs";
import {ActiveEnum, OrderByEnum, OrderDirEnum} from "@utility/domain/enum";
import {inject} from "@angular/core";
import {getMaxPage} from "@utility/domain/max-page";
import {Router} from "@angular/router";
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {NGXLogger} from "ngx-logger";
import {RIBaseEntity} from "@utility/domain";
import {NgEventBus} from "ng-event-bus";

export interface IBaseState_Item<ITEM> {
	data: undefined | ITEM;
	downloadedAt: Date;
}

export interface IBaseState<ITEM> {
	item: IBaseState_Item<ITEM>;
	tableState: ITableState<ITEM>;
	lastTableHashSum: undefined | string;
}

export function baseDefaults<T>({filters, orderBy, orderDir}: {
	filters: { [key: string]: unknown; };
	orderBy: OrderByEnum;
	orderDir: OrderDirEnum;
}): IBaseState<T> {
	return {
		item: {
			data: undefined,
			downloadedAt: new Date(),
		},
		tableState: new TableState<T>().setFilters(filters).setOrderBy(orderBy).setOrderDir(orderDir).toCache(),
		lastTableHashSum: undefined,
	};
}

export function buildCacheKey(...keys: string[]): string {
	return keys.join('.');
}

export function getKeyWithClientId(store: Store, ...keys: string[]): string {

	const {identity} = store.snapshot();

	if (!identity) {
		throw new Error('Store Snapshot: identity is absent!');
	}

	const {token} = identity;

	if (!token) {
		throw new Error('Store Snapshot: token is absent!');
	}

	const {claims} = token;

	if (!claims) {
		throw new Error('Store Snapshot: claims is absent!');
	}

	const {clientId} = claims;

	if (!clientId) {
		throw new Error('Store Snapshot: clientId is absent!');
	}

	return buildCacheKey(clientId, ...keys);
}

export abstract class BaseState<ITEM extends RIBaseEntity<string>> {

	protected readonly ngEventBus = inject(NgEventBus);

	protected readonly router = inject(Router);
	protected readonly store = inject(Store);
	protected readonly logger = inject(NGXLogger);

	protected readonly item!: BaseApiAdapter<ITEM, unknown[]>;
	protected readonly create!: BaseApiAdapter<ITEM, unknown[]>;
	protected readonly update!: BaseApiAdapter<ITEM, unknown[]>;
	protected readonly remove!: BaseApiAdapter<unknown, unknown[]>;
	protected readonly archive!: BaseApiAdapter<unknown, unknown[]>;
	protected readonly list!: BaseApiAdapter<{
		items: ITEM[];
		totalSize: number;
	}, unknown[]>;

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
	 * @constructor
	 */
	public updateFilters(ctx: StateContext<IBaseState<ITEM>>, {payload}: BaseActions.UpdateFilters) {

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
	 * @constructor
	 */
	public updateTableState(ctx: StateContext<IBaseState<ITEM>>, {payload}: BaseActions.UpdateTableState<ITEM>) {

		const state = ctx.getState();

		if (Reflect.has(payload, 'orderBy') && Reflect.has(state.tableState, 'orderDir')) {
			if (state.tableState.orderBy === payload.orderBy) {
				payload['orderDir'] = state.tableState.orderDir === OrderDirEnum.ASC ? OrderDirEnum.DESC : OrderDirEnum.ASC;
			}
		}

		const newTableState = TableState.fromCache({
			...state.tableState,
			...payload
		});

		ctx.patchState({
			tableState: newTableState.toCache()
		});

	}

	/**
	 *
	 * @param ctx
	 * @param payload
	 * @constructor
	 */
	public async getItemFromCacheOrApi(ctx: StateContext<IBaseState<ITEM>>, {payload}: BaseActions.GetItem): Promise<void> {

		await firstValueFrom(ctx.dispatch(new AppActions.PageLoading(true)));

		const data = await this.item.executeAsync(payload);

		const item = {
			data,
			downloadedAt: new Date(),
		};

		ctx.patchState({
			item
		});

		await firstValueFrom(ctx.dispatch(new AppActions.PageLoading(false)));

	}

	/**
	 *
	 * @param ctx
	 * @param payload
	 */
	public async createItem(ctx: StateContext<IBaseState<ITEM>>, {payload}: BaseActions.CreateItem<ITEM>): Promise<void> {

		ctx.dispatch(new AppActions.PageLoading(true));

		try {
			const data = await this.create.executeAsync(payload);

			// Set new/updated item to store state and clear table
			ctx.patchState({
				item: {
					data,
					downloadedAt: new Date(),
				},
				tableState: structuredClone(this.defaults).tableState,
				lastTableHashSum: undefined
			});
		} catch (e) {
			this.logger.error('Error Response: ', e)
		}

		ctx.dispatch(new AppActions.PageLoading(false));

	}

	/**
	 *
	 * @param ctx
	 * @param payload
	 */
	public async updateItem(ctx: StateContext<IBaseState<ITEM>>, {payload}: BaseActions.UpdateItem<ITEM>): Promise<void> {

		ctx.dispatch(new AppActions.PageLoading(true));

		try {
			const data = await this.update.executeAsync(payload);

			// Set new/updated item to store state and clear table
			ctx.patchState({
				item: {
					data,
					downloadedAt: new Date(),
				},
				tableState: new TableState<ITEM>().toCache(),
				lastTableHashSum: undefined
			});
		} catch (e) {
			this.logger.error(e);
		}

		ctx.dispatch(new AppActions.PageLoading(false));

	}

	/**
	 *
	 * @param ctx
	 * @param payload
	 */
	public async deleteItem(ctx: StateContext<IBaseState<ITEM>>, {payload}: BaseActions.DeleteItem): Promise<void> {

		await firstValueFrom(ctx.dispatch(new AppActions.PageLoading(true)));

		const result = await this.remove.executeAsync(payload);

		if (result) {


			ctx.patchState({
				item: {
					data: undefined,
					downloadedAt: new Date(),
				}
			});


		}

		await firstValueFrom(ctx.dispatch(new AppActions.PageLoading(false)));

	}

	/**
	 *
	 * @param ctx
	 * @param payload
	 */
	public async archiveItem(ctx: StateContext<IBaseState<ITEM>>, {payload}: BaseActions.ArchiveItem): Promise<void> {

		ctx.dispatch(new AppActions.PageLoading(true));

		try {
			await this.archive.executeAsync(payload);

			const state = ctx.getState();

			ctx.patchState({
				item: {
					data: {
						...state.item.data,
						active: ActiveEnum.NO
					} as never,
					downloadedAt: new Date(),
				}
			});


		} catch (e) {
			this.logger.error(e);
		}

		ctx.dispatch(new AppActions.PageLoading(false));
	}

	/**
	 *
	 * @param ctx
	 * @param force
	 * @param resetPage
	 */
	public async getList(ctx: StateContext<IBaseState<ITEM>>, {
		payload: {
			// force,
			resetPage,
			resetParams
		}
	}: BaseActions.GetList): Promise<void> {

		await firstValueFrom(ctx.dispatch(new AppActions.PageLoading(true)));

		const state = ctx.getState();

		try {

			const newTableState = TableState.fromCache<ITEM>(state.tableState);

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
			this.logger.error(e);
		}

		// Switch of page loader
		await firstValueFrom(ctx.dispatch(new AppActions.PageLoading(false)));

	}


}
