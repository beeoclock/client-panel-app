import {StateContext} from "@ngxs/store";
import {Pagination} from "@utility/domain";
import {BaseActions} from "@utility/state/base/base.actions";
import {Observable} from "rxjs";
import {AppActions} from "@utility/state/app/app.actions";
import {CacheActions} from "@utility/state/cache/cache.actions";

export interface IBaseStateList<ITEM> {
  filters: {
    search: undefined | string;
  },
  pagination: Pagination<ITEM>,
  lastPaginationHasSum: undefined | string;
  loading: boolean;
  items: ITEM[];
  total: number;
}

export interface IBaseState<ITEM> {
  list: IBaseStateList<ITEM>;
  item: {
    data: undefined | ITEM;
    downloadedAt: Date;
  };
  cache: {
    items: {
      [key: string]: {
        data: ITEM | undefined;
        downloadedAt: Date;
      }
    };
    lists: { [key: string]: IBaseStateList<ITEM> };
  }
}

export function baseDefaults<T>(): IBaseState<T> {
  return {
    item: {
      data: undefined,
      downloadedAt: new Date(),
    },
    list: {
      filters: {
        search: undefined,
      },
      loading: false,
      pagination: new Pagination<T>(),
      lastPaginationHasSum: undefined,
      items: [],
      total: 0
    },
    cache: {
      items: {},
      lists: {}
    }
  };
}

export abstract class BaseState<ITEM = any> {

  protected constructor(
    public readonly actions: any,
    public readonly cacheKeys: {
      lists: string;
      items: string;
    } = {
      lists: 'TODO',
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

    const lists = JSON.parse(localStorage.getItem(this.cacheKeys.lists) ?? '{}');
    const items = JSON.parse(localStorage.getItem(this.cacheKeys.items) ?? '{}');

    ctx.patchState({
      cache: {
        lists,
        items,
      }
    });

  }

  /**
   *
   * @param ctx
   * @param payload
   * @constructor
   */
  public async UpdateFilters(ctx: StateContext<IBaseState<ITEM>>, {payload}: BaseActions.UpdateFilters): Promise<void> {

    const store = ctx.getState();

    ctx.patchState({
      ...store,
      list: {
        ...store.list,
        filters: payload,
      }
    });

    ctx.dispatch(new this.actions.UpdateQueryParamsAtNavigator());

  }

  /**
   *
   * @param ctx
   * @param payload
   * @constructor
   */
  public async UpdateQueryParamsAtNavigator(ctx: StateContext<IBaseState<ITEM>>, {payload}: BaseActions.UpdateQueryParamsAtNavigator): Promise<void> {

    const store = ctx.getState();

    await this.router.navigate(payload, {
      queryParams: {
        ...store.list.pagination.toQueryParams(),
        ...store.list.filters
      },
      queryParamsHandling: "merge",
      replaceUrl: true
    });

  }

  /**
   *
   * @param ctx
   * @param payload
   * @constructor
   */
  public UpdatePaginationFromQueryParams(ctx: StateContext<IBaseState<ITEM>>, {payload}: BaseActions.UpdatePaginationFromQueryParams): Observable<any> {

    const store = ctx.getState();
    const newPagination = Pagination.fromObject(store.list.pagination);
    newPagination.fromQueryParams(payload);

    ctx.patchState({
      ...store,
      list: {
        ...store.list,
        pagination: newPagination,
      }
    })

    return ctx.dispatch(new this.actions.GetList());

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

      const itemFromCache = state.cache.items[payload];

      if (itemFromCache) {

        ctx.patchState({
          ...state,
          item: itemFromCache
        });

      } else {

        ctx.dispatch(new AppActions.PageLoading(true));

        const {data} = await this.repository.item(payload);

        // Check if we have prev state, if true, update cache
        if (state.item.data) {

          // Update local cache and update localStorage
          ctx.patchState({
            cache: {
              ...state.cache,
              items: {
                ...state.cache.items,
                [payload]: state.item
              }
            }
          });

          state = ctx.getState();

          ctx.dispatch(new CacheActions.Set({
            strategy: localStorage,
            key: this.cacheKeys.items,
            value: JSON.stringify(state.cache.items)
          }));

        }

        ctx.patchState({
          ...state,
          item: {
            data,
            downloadedAt: new Date(),
          }
        });

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

    if (state.list.pagination.hashSum !== state.list.lastPaginationHasSum) {

      // Check if in local cache exist data of current pagination has
      if (
        state.list.pagination.hashSum &&
        Reflect.has(state.cache.lists, state.list.pagination.hashSum)
      ) {

        const prevListState = state.cache.lists[state.list.pagination.hashSum];
        const newPagination = Pagination.fromObject(prevListState.pagination);

        ctx.patchState({
          ...state,
          list: {
            ...prevListState,
            pagination: newPagination,
            lastPaginationHasSum: newPagination.hashSum,
          }
        });

      } else {

        ctx.dispatch(new AppActions.PageLoading(true));

        const {
          pageSize,
          page,
          orderBy,
          orderDir,
        } = state.list.pagination.toQueryParams();

        const filters: any = {};

        filterProcessing?.(filters, state.list.filters);

        const {data} = await this.repository.list(
          pageSize,
          page,
          orderBy,
          orderDir,
          filters
        );

        // Update current state
        const {items, total} = data;
        const newPagination = Pagination.fromObject(state.list.pagination);
        newPagination.setTotalSize(total);

        ctx.patchState({
          ...state,
          list: {
            ...state.list,
            pagination: newPagination,
            lastPaginationHasSum: newPagination.hashSum,
            items,
            total,
          }
        });

        state = ctx.getState();

        // Check if we have prev state, if true, update cache
        if (items.length && state.list.pagination.hashSum) {

          // Update local cache and update localStorage
          ctx.patchState({
            cache: {
              ...state.cache,
              lists: {
                ...state.cache.lists,
                [state.list.pagination.hashSum]: state.list
              }
            }
          });

          state = ctx.getState();

          ctx.dispatch(new CacheActions.Set({
            strategy: localStorage,
            key: this.cacheKeys.lists,
            value: JSON.stringify(state.cache.lists)
          }));

        }

        // Switch of page loader
        ctx.dispatch(new AppActions.PageLoading(false));

      }

    }

  }

}
