import {StateContext, Store} from "@ngxs/store";
import {BaseActions} from "@utility/state/base/base.actions";
import {AppActions} from "@utility/state/app/app.actions";
import {CacheActions} from "@utility/state/cache/cache.actions";
import {ITableState, TableState} from "@utility/domain/table.state";
import {firstValueFrom} from "rxjs";
import {ICacheState} from "@utility/state/cache/cache.state";
import {ActiveEnum} from "@utility/domain/enum";
import {inject} from "@angular/core";
import {getMaxPage} from "@utility/domain/max-page";
import {Router} from "@angular/router";
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {CACHE_TABLE_CLEAR_AFTER_MS} from "@src/token";

export interface IBaseState_Item<ITEM> {
	data: undefined | ITEM;
	downloadedAt: Date;
}

export interface IBaseState<ITEM> {
	item: IBaseState_Item<ITEM>;
	tableState: ITableState<ITEM>;
	lastTableHashSum: undefined | string;
}

export function baseDefaults<T>(filters = {}): IBaseState<T> {
	return {
		item: {
			data: undefined,
			downloadedAt: new Date(),
		},
		tableState: new TableState<T>().setFilters(filters).toCache(),
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

export abstract class BaseState<ITEM = any> {

	protected constructor(
		public readonly actions: any,
		public readonly cacheKeys: {
			tableStates: string;
			items: string;
		} = {
			tableStates: 'TODO',
			items: 'TODO',
		},
	) {
	}

	protected readonly router = inject(Router);
	protected readonly store = inject(Store);
	protected readonly cacheTableClearAfterMs = inject(CACHE_TABLE_CLEAR_AFTER_MS);

	protected readonly item!: BaseApiAdapter<ITEM>;
	protected readonly create!: BaseApiAdapter<ITEM>;
	protected readonly update!: BaseApiAdapter<ITEM>;
	protected readonly remove!: BaseApiAdapter<unknown>;
	protected readonly archive!: BaseApiAdapter<unknown>;
	protected readonly list!: BaseApiAdapter<{
		items: ITEM[];
		totalSize: number;
	}>;

	/**
	 * Init default from cache
	 * @param ctx
	 * @constructor
	 */
	public async init(
		ctx: StateContext<IBaseState<ITEM>>
	): Promise<void> {

		ctx.setState(baseDefaults());

	}

	/**
	 * Init default from cache
	 * @param ctx
	 * @constructor
	 */
	public async InitDefaultsFromCache(
		ctx: StateContext<IBaseState<ITEM>>
	): Promise<void> {

		await firstValueFrom(ctx.dispatch(new CacheActions.Get({
			strategy: 'indexedDB',
			key: getKeyWithClientId(this.store, this.cacheKeys.tableStates),
		})));

		await firstValueFrom(ctx.dispatch(new CacheActions.Get({
			strategy: 'indexedDB',
			key: getKeyWithClientId(this.store, this.cacheKeys.items),
		})));

	}

	/**
	 * Init default from cache
	 * @param ctx
	 * @constructor
	 */
	public async ClearTableCache(
		ctx: StateContext<IBaseState<ITEM>>
	): Promise<void> {

		const cacheTableStatesKey = getKeyWithClientId(this.store, this.cacheKeys.tableStates);

		// Clear cache of table
		await firstValueFrom(ctx.dispatch(new CacheActions.Remove({
			strategy: 'indexedDB',
			key: cacheTableStatesKey,
		})));

	}

	/**
	 * Init default from cache
	 * @param ctx
	 * @constructor
	 */
	public async ClearTableCacheAndGetList(
		ctx: StateContext<IBaseState<ITEM>>
	): Promise<void> {

		await this.ClearTableCache(ctx);
		ctx.patchState({
			lastTableHashSum: undefined,
		});
		await this.getList(ctx);

	}

	/**
	 * Init default from cache
	 * @param ctx
	 * @constructor
	 */
	public async ClearItemCache(
		ctx: StateContext<IBaseState<ITEM>>
	): Promise<void> {

		const cacheItemsKey = getKeyWithClientId(this.store, this.cacheKeys.items);

		// Clear all history from cache
		// Clear cache of item
		await firstValueFrom(ctx.dispatch(new CacheActions.Remove({
			strategy: 'indexedDB',
			key: cacheItemsKey,
		})));

	}

	/**
	 * Init default from cache
	 * @param ctx
	 * @constructor
	 */
	public async ClearItemCacheAndGetItem(
		ctx: StateContext<IBaseState<ITEM>>
	): Promise<void> {

		const {id} = ctx.getState().item.data as any;
		if (id) {
			await this.ClearItemCache(ctx);
			ctx.patchState({
				item: undefined,
			});
			await this.getItemFromCacheOrApi(ctx, id);
		}

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
				payload['orderDir'] = state.tableState.orderDir === 'asc' ? 'desc' : 'asc';
			}
		}

		const newTableState = TableState.fromCache({
			...state.tableState,
			...payload
		});

		ctx.patchState({
			...state,
			tableState: newTableState.toCache()
		});

	}

	/**
	 *
	 * @param cacheItemsKey
	 * @param ctx
	 * @param id
	 */
	public getItemFromCache(
		cacheItemsKey: string,
		ctx: StateContext<IBaseState<ITEM>>,
		id: string
	): IBaseState_Item<ITEM> | undefined {

		const {cache}: { cache: ICacheState } = this.store.snapshot();

		const customerCacheItems = cache[cacheItemsKey];

		if (customerCacheItems) {

			return customerCacheItems[id];

		}

		return undefined;

	}

	public saveToCache(
		cacheItemsKey: string,
		ctx: StateContext<IBaseState<ITEM>>,
		item: IBaseState_Item<ITEM>,
		payload: string,
	): void {

		const {cache}: { cache: ICacheState } = this.store.snapshot();

		const customerCacheItems = cache[cacheItemsKey];

		ctx.dispatch(new CacheActions.Set({
			strategy: 'indexedDB',
			key: cacheItemsKey,
			value: JSON.stringify({
				...customerCacheItems,
				[payload]: item
			})
		}));

	}

	/**
	 *
	 * @param ctx
	 * @param payload
	 * @constructor
	 */
	public async getItemFromCacheOrApi(ctx: StateContext<IBaseState<ITEM>>, {payload}: BaseActions.GetItem): Promise<void> {

		await firstValueFrom(ctx.dispatch(new AppActions.PageLoading(true)));

		const cacheItemsKey = getKeyWithClientId(this.store, this.cacheKeys.items);

		const itemFromCache = this.getItemFromCache(cacheItemsKey, ctx, payload);

		if (itemFromCache) {

			ctx.patchState({
				item: itemFromCache
			});

		} else {

			const data = await this.item.executeAsync(payload);

			const item = {
				data,
				downloadedAt: new Date(),
			};

			ctx.patchState({
				item
			});

			this.saveToCache(cacheItemsKey, ctx, item, payload);

		}

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
			// TODO Implement: Error case
			const data = await this.create.executeAsync(payload);

			await this.ClearItemCache(ctx);
			await this.ClearTableCache(ctx);

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
			console.error('Error Response: ', e);
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
			// TODO Implement: Error case
			const data = await this.update.executeAsync(payload);

			await this.ClearItemCache(ctx);
			await this.ClearTableCache(ctx);

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
			console.error('Error Response: ', e);
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

			const state = ctx.getState();
			const {_id} = (state.item?.data ?? {}) as { _id: string };

			if (_id === payload) {

				ctx.patchState({
					item: {
						data: undefined,
						downloadedAt: new Date(),
					}
				});

			} else {

				// TODO delete from cache

			}

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
			const {_id} = (state.item?.data ?? {}) as { _id: string };

			if (_id === payload) {

				ctx.patchState({
					item: {
						data: {
							...state.item.data,
							active: ActiveEnum.NO
						} as any,
						downloadedAt: new Date(),
					}
				});

			} else {

				// TODO delete from cache

			}

		} catch (e) {
			console.error(e);
		}

		ctx.dispatch(new AppActions.PageLoading(false));
	}

	/**
	 *
	 * @param ctx
	 */
	public async getList(ctx: StateContext<IBaseState<ITEM>>): Promise<void> {

		await firstValueFrom(ctx.dispatch(new AppActions.PageLoading(true)));

		let state = ctx.getState();

		// Check if hasSun is not null or undefined or 0
		if (state.tableState.hashSum && state.lastTableHashSum) {
			if (state.tableState.hashSum === state.lastTableHashSum) {
				// Check if cache is not expired
				if (this.cacheTableClearAfterMs > (new Date().getTime() - new Date(state.tableState.lastUpdate).getTime())) {

					// Switch of page loader
					await firstValueFrom(ctx.dispatch(new AppActions.PageLoading(false)));

					return;

				}
			}
		}

		const {cache}: { cache: ICacheState } = this.store.snapshot();
		const cacheTableStatesKey = getKeyWithClientId(this.store, this.cacheKeys.tableStates);

		const cacheTableStates = cache[cacheTableStatesKey];

		const prevListState: TableState<ITEM> = (cacheTableStates ?? {})[state.tableState.hashSum];

		// Check if in local cache exist data of current pagination has
		if (
			state.tableState.hashSum &&
			cacheTableStates &&
			Reflect.has(cacheTableStates, state.tableState.hashSum) &&
			// Check if cache is not expired
			this.cacheTableClearAfterMs > (new Date().getTime() - new Date(prevListState.lastUpdate).getTime())
		) {

			ctx.patchState({
				...state,
				tableState: prevListState,
				lastTableHashSum: prevListState.hashSum
			});

		} else {

			try {

				const newTableState = TableState.fromCache<ITEM>(state.tableState);

				const params = newTableState.toBackendFormat();

				// Update current state
				const {items, totalSize} = await this.list.executeAsync(params);

				newTableState.total = totalSize;
				newTableState.items = items;
				newTableState.maxPage = getMaxPage(newTableState.total, newTableState.pageSize);

				ctx.patchState({
					...state,
					tableState: newTableState.toCache(),
					lastTableHashSum: newTableState.hashSum
				});

				state = ctx.getState();

				// Check if we have prev state, if true, update cache
				if (items.length && state.tableState.hashSum) {

					const newCacheValue = {
						...cacheTableStates,
						[state.tableState.hashSum]: state.tableState
					};

					await firstValueFrom(ctx.dispatch(new CacheActions.Set({
						strategy: 'indexedDB',
						key: cacheTableStatesKey,
						value: JSON.stringify(newCacheValue)
					})));

				}

			} catch (e) {
				console.error(e);
			}

		}

		// Switch of page loader
		await firstValueFrom(ctx.dispatch(new AppActions.PageLoading(false)));

	}


}
