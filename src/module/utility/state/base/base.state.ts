import {StateContext} from "@ngxs/store";
import {BaseActions} from "@utility/state/base/base.actions";
import {AppActions} from "@utility/state/app/app.actions";
import {CacheActions} from "@utility/state/cache/cache.actions";
import {ITableState, TableState} from "@utility/domain/table.state";
import {firstValueFrom} from "rxjs";
import {ICacheState} from "@utility/state/cache/cache.state";

export interface IBaseState<ITEM> {
  item: {
    data: undefined | ITEM;
    downloadedAt: Date;
  };
  tableState: ITableState<ITEM>;
  lastTableHashSum: undefined | string;
  // cache: {
  //   items: {
  //     [key: string]: {
  //       data: ITEM | undefined;
  //       downloadedAt: Date;
  //     }
  //   };
  // }
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

  /**
   * Init default from cache
   * @param ctx
   * @constructor
   */
  public async InitDefaultsFromCache(
    ctx: StateContext<IBaseState<ITEM>>
  ): Promise<void> {

    ctx.dispatch(new CacheActions.Get({
      strategy: 'indexedDB',
      key: this.cacheKeys.tableStates,
    }));

    ctx.dispatch(new CacheActions.Get({
      strategy: 'indexedDB',
      key: this.cacheKeys.items,
    }));

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

    let state = ctx.getState();


    const {_id} = (state.item?.data ?? {}) as { _id: string };

    if (_id !== payload) {

      const {cache}: { cache: ICacheState } = await firstValueFrom(
        ctx.dispatch(
          new CacheActions.Get({
            strategy: 'indexedDB',
            key: this.cacheKeys.tableStates,
          })
        )
      ) as any;

      let itemFromCache = undefined;

      const customerCacheItems = cache[this.cacheKeys.items];

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
          ...state,
          item
        });

        ctx.dispatch(new CacheActions.Set({
          strategy: 'indexedDB',
          key: this.cacheKeys.items,
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
  public deleteItem(ctx: StateContext<IBaseState<ITEM>>, {payload}: BaseActions.DeleteItem): void {

    ctx.dispatch(new AppActions.PageLoading(true));

    const {id, refreshList, goToTheList} = payload;
    this.repository.remove(id).then((result: any) => {
      if (result) {

        const state = ctx.getState();
        const {_id} = (state.item?.data ?? {}) as { _id: string };

        if (_id === id) {

          ctx.patchState({
            item: {
              data: undefined,
              downloadedAt: new Date(),
            }
          });

        } else {

          // TODO delete from cache

        }

        if (goToTheList) {
          this.router.navigate(['/', 'employee']);
        } else {
          if (refreshList ?? true) {
            ctx.dispatch(new this.actions.GetList());
          }
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

    const {cache}: { cache: ICacheState } = await firstValueFrom(
      ctx.dispatch(
        new CacheActions.Get({
          strategy: 'indexedDB',
          key: this.cacheKeys.tableStates,
        })
      )
    ) as any;

    const customerCacheTableStates = cache[this.cacheKeys.tableStates];

    // Check if in local cache exist data of current pagination has
    if (
      state.tableState.hashSum &&
      Reflect.has(customerCacheTableStates, state.tableState.hashSum)
    ) {

      const prevListState = customerCacheTableStates[state.tableState.hashSum];

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

      const {data} = await this.repository.list(newTableState.toBackendFormat());

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

        // Update local cache
        state = ctx.getState();

        ctx.dispatch(new CacheActions.Set({
          strategy: 'indexedDB',
          key: this.cacheKeys.tableStates,
          value: JSON.stringify({
            ...customerCacheTableStates,
            [state.tableState.hashSum]: state.tableState
          })
        }));

      }

      // Switch of page loader
      ctx.dispatch(new AppActions.PageLoading(false));

    }

  }


}
