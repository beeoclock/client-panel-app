import {StateContext} from "@ngxs/store";
import {Pagination} from "@utility/domain";
import {BaseActions} from "@utility/state/base/base.actions";
import {Observable} from "rxjs";
import {AppActions} from "@utility/state/app/app.actions";

export interface IBaseState<ITEM> {
  list: {
    filters: {
      search: undefined | string;
    },
    pagination: Pagination<ITEM>,
    lastPaginationHasSum: undefined | string;
    loading: boolean;
    items: ITEM[];
    total: number;
  };
  item: {
    data: undefined | ITEM
  };
}

export abstract class BaseState<ITEM = any> {

  protected constructor(
    public readonly actions: any
  ) {
  }

  public readonly router!: any;
  public readonly repository!: any;

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

    const store = ctx.getState();

    try {

      const {_id} = (store.item?.data ?? {}) as { _id: string };

      if (_id !== payload) {

        ctx.dispatch(new AppActions.PageLoading(true));

        ctx.patchState({
          ...store,
          item: {
            data: undefined,
          }
        });

        const {data} = await this.repository.item(payload);

        ctx.patchState({
          ...store,
          item: {
            data
          }
        });

        ctx.dispatch(new AppActions.PageLoading(false));

      }
    } catch (e) {

      throw e;

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
            }
          })
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

    const state = ctx.getState();

    if (state.list.pagination.hasSum !== state.list.lastPaginationHasSum) {

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

      const {items, total} = data;
      const newPagination = Pagination.fromObject(state.list.pagination);
      newPagination.setTotalSize(total);

      ctx.patchState({
        ...state,
        list: {
          ...state.list,
          pagination: newPagination,
          lastPaginationHasSum: newPagination.hasSum,
          items,
          total,
        }
      });

      ctx.dispatch(new AppActions.PageLoading(false));

    }

  }

}
