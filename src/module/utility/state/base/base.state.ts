import {StateContext} from "@ngxs/store";
import {Pagination} from "@utility/domain";
import {BaseActions} from "@utility/state/base/base.actions";

export interface IBaseState<ITEM> {
  list: {
    filters: {
      search: undefined | string;
    },
    pagination: Pagination<ITEM>,
    loading: boolean;
    items: ITEM[];
    total: number;
  };
  item: {
    loading: boolean;
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

  public async UpdateQueryParamsAtNavigator(ctx: StateContext<IBaseState<ITEM>>): Promise<void> {

    const store = ctx.getState();

    await this.router.navigate([], {
      queryParams: {
        ...store.list.pagination.toQueryParams(),
        ...store.list.filters
      },
      queryParamsHandling: "merge",
      replaceUrl: true
    });

  }

  public UpdatePaginationFromQueryParams(ctx: StateContext<IBaseState<ITEM>>, {payload}: BaseActions.UpdatePaginationFromQueryParams): void {

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

    ctx.dispatch(new this.actions.GetList());

  }

  public async GetItem(ctx: StateContext<IBaseState<ITEM>>, {payload}: BaseActions.GetItem): Promise<void> {

    const store = ctx.getState();

    ctx.patchState({
      ...store,
      item: {
        data: undefined,
        loading: true,
      }
    });

    const {data} = await this.repository.item(payload);

    ctx.patchState({
      ...store,
      item: {
        loading: false,
        data
      }
    });

  }

  public deleteItem(ctx: StateContext<IBaseState<ITEM>>, {payload}: BaseActions.DeleteItem): void {
    const {id, refreshList, goToTheList} = payload;
    this.repository.remove(id).then((result: any) => {
      if (result) {
        if (goToTheList) {
          this.router.navigate(['/', 'employee']);
        } else {
          if (refreshList ?? true) {
            ctx.dispatch(new this.actions.GetList());
          }
        }
      }
    });
  }

  public async getList(ctx: StateContext<IBaseState<ITEM>>, filterProcessing?: <T = any, FILTERS = any>(queryFilters: T, filters: FILTERS) => void): Promise<void> {

    const state = ctx.getState();

    ctx.patchState({
      ...state,
      list: {
        ...state.list,
        loading: true,
      }
    })

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
        items,
        total,
        loading: false,
      }
    });

  }

}
