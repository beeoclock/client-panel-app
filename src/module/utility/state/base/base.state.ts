import {StateContext, Store} from "@ngxs/store";
import {BaseActions} from "@utility/state/base/base.actions";
import {AppActions} from "@utility/state/app/app.actions";
import {CacheActions} from "@utility/state/cache/cache.actions";
import {ITableState, TableState} from "@utility/domain/table.state";
import {firstValueFrom} from "rxjs";
import {ICacheState} from "@utility/state/cache/cache.state";
import {ActiveEnum} from "@utility/domain/enum";
import {inject} from "@angular/core";

export interface IBaseState<ITEM> {
  item: {
    data: undefined | ITEM;
    downloadedAt: Date;
  };
  tableState: ITableState<ITEM>;
  lastTableHashSum: undefined | string;
}

export function baseDefaults<T>(): IBaseState<T> {
  return {
    item: {
      data: undefined,
      downloadedAt: new Date(),
    },
    tableState: new TableState<T>().toCache(),
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

  public readonly router!: any;
  public readonly repository!: any;
  public readonly store = inject(Store);

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

    console.log('InitDefaultsFromCache: START');

    console.log(getKeyWithClientId(this.store, this.cacheKeys.tableStates));

    await firstValueFrom(ctx.dispatch(new CacheActions.Get({
      strategy: 'indexedDB',
      key: getKeyWithClientId(this.store, this.cacheKeys.tableStates),
    })));

    await firstValueFrom(ctx.dispatch(new CacheActions.Get({
      strategy: 'indexedDB',
      key: getKeyWithClientId(this.store, this.cacheKeys.items),
    })));

    console.log('InitDefaultsFromCache: finish');

  }

  /**
   *
   * @param ctx
   * @param payload
   * @constructor
   */
  public async UpdateFilters(ctx: StateContext<IBaseState<ITEM>>, {payload}: BaseActions.UpdateFilters): Promise<void> {

    const state = ctx.getState();

    await this.UpdateTableState(ctx, {
      payload: {
        ...state.tableState,
        filters: {
          ...state.tableState.filters,
          ...payload
        }
      }
    });

  }

  /**
   *
   * @param ctx
   * @param payload
   * @constructor
   */
  public async UpdateTableState(ctx: StateContext<IBaseState<ITEM>>, {payload}: BaseActions.UpdateTableState<ITEM>): Promise<void> {

    const state = ctx.getState();

    if ('orderBy' in payload && !('orderDir' in payload)) {
      if (state.tableState.orderBy === payload.orderBy) {
        payload['orderDir'] = state.tableState.orderDir === 'asc' ? 'desc' : 'asc';
      }
    }

    const newTableState = TableState.fromCache(state.tableState);
    Object.keys(payload).forEach((key) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      newTableState[key] = payload[key];
    });

    ctx.patchState({
      ...state,
      tableState: newTableState.toCache()
    });

  }

  /**
   *
   * @param ctx
   * @param payload
   * @constructor
   */
  public async GetItem(ctx: StateContext<IBaseState<ITEM>>, {payload}: BaseActions.GetItem): Promise<void> {

    const state = ctx.getState();

    const {_id} = (state.item?.data ?? {}) as { _id: string };

    if (_id !== payload) {

      const {cache}: { cache: ICacheState } = this.store.snapshot();

      let itemFromCache = undefined;

      const cacheItemsKey = getKeyWithClientId(this.store, this.cacheKeys.items);

      const customerCacheItems = cache[cacheItemsKey];

      if (customerCacheItems) {

        itemFromCache = customerCacheItems[payload];

      }

      if (itemFromCache) {

        ctx.patchState({
          ...state,
          item: itemFromCache
        });

      } else {

        ctx.dispatch(new AppActions.PageLoading(true));

        const {data} = await this.repository.item(payload);

        const item = {
          data,
          downloadedAt: new Date(),
        };

        ctx.patchState({
          item
        });

        ctx.dispatch(new CacheActions.Set({
          strategy: 'indexedDB',
          key: cacheItemsKey,
          value: JSON.stringify({
            ...customerCacheItems,
            [payload]: item
          })
        }));

        ctx.dispatch(new AppActions.PageLoading(false));

      }

    }

  }

  /**
   *
   * @param ctx
   * @param payload
   */
  public async saveItem(ctx: StateContext<IBaseState<ITEM>>, {payload}: BaseActions.SaveItem<ITEM>): Promise<void> {

    ctx.dispatch(new AppActions.PageLoading(true));

    // TODO Implement: Error case
    const data = await this.repository.save(payload);

    const cacheTableStatesKey = getKeyWithClientId(this.store, this.cacheKeys.tableStates);
    const cacheItemsKey = getKeyWithClientId(this.store, this.cacheKeys.items);

    // Clear all history from cache
    // Clear cache of item
    await firstValueFrom(ctx.dispatch(new CacheActions.Remove({
      strategy: 'indexedDB',
      key: cacheItemsKey,
    })));
    // Clear cache of table
    await firstValueFrom(ctx.dispatch(new CacheActions.Remove({
      strategy: 'indexedDB',
      key: cacheTableStatesKey,
    })));

    // Set new/updated item to store state and clear table
    ctx.patchState({
      item: {
        data,
        downloadedAt: new Date(),
      },
      tableState: new TableState<ITEM>().toCache(),
      lastTableHashSum: undefined
    });

    ctx.dispatch(new AppActions.PageLoading(false));

  }

  /**
   *
   * @param ctx
   * @param payload
   */
  public deleteItem(ctx: StateContext<IBaseState<ITEM>>, {payload}: BaseActions.DeleteItem): void {

    ctx.dispatch(new AppActions.PageLoading(true));

    this.repository.remove(payload).then((result: any) => {
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
    });

    ctx.dispatch(new AppActions.PageLoading(false));
  }

  /**
   *
   * @param ctx
   * @param payload
   */
  public archiveItem(ctx: StateContext<IBaseState<ITEM>>, {payload}: BaseActions.ArchiveItem): void {

    ctx.dispatch(new AppActions.PageLoading(true));

    this.repository.archive(payload).then((result: any) => {
      if (result) {

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
      }
    });

    ctx.dispatch(new AppActions.PageLoading(false));
  }

  /**
   *
   * @param ctx
   * @param filterProcessing
   */
  public async getList(ctx: StateContext<IBaseState<ITEM>>, filterProcessing?: <T = any, FILTERS = any>(queryFilters: T, filters: FILTERS) => void): Promise<void> {

    let state = ctx.getState();

    // Check if hasSun is not null or undefined or 0
    if (state.tableState.hashSum && state.lastTableHashSum) {
      if (state.tableState.hashSum === state.lastTableHashSum) {
        return;
      }
    }

    const {cache}: { cache: ICacheState } = this.store.snapshot();
    const cacheTableStatesKey = getKeyWithClientId(this.store, this.cacheKeys.tableStates);

    const cacheTableStates = cache[cacheTableStatesKey];

    // Check if in local cache exist data of current pagination has
    if (
      state.tableState.hashSum && cacheTableStates &&
      Reflect.has(cacheTableStates, state.tableState.hashSum)
    ) {

      const prevListState = cacheTableStates[state.tableState.hashSum];

      ctx.patchState({
        ...state,
        tableState: prevListState,
        lastTableHashSum: prevListState.hashSum
      });

    } else {

      ctx.dispatch(new AppActions.PageLoading(true));

      const filters: any = {};

      filterProcessing?.(filters, state.tableState.filters);

      const newTableState = TableState.fromCache<ITEM>(state.tableState);

      const {data} = await this.repository.list({
        ...newTableState.toBackendFormat(),
        filters
      });

      // Update current state
      const {items, total} = data;

      newTableState.total = total;
      newTableState.items = items;

      ctx.patchState({
        ...state,
        tableState: newTableState.toCache(),
        lastTableHashSum: newTableState.hashSum
      });

      state = ctx.getState();

      // Check if we have prev state, if true, update cache
      if (items.length && state.tableState.hashSum) {

        ctx.dispatch(new CacheActions.Set({
          strategy: 'indexedDB',
          key: cacheTableStatesKey,
          value: JSON.stringify({
            ...cacheTableStates,
            [state.tableState.hashSum]: state.tableState
          })
        }));

      }

      // Switch of page loader
      ctx.dispatch(new AppActions.PageLoading(false));

    }

  }


}
