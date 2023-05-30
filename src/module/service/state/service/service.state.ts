import {inject, Injectable} from "@angular/core";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import * as Service from "@service/domain";
import {Router} from "@angular/router";
import {Pagination} from "@utility/domain";
import {ServiceActions} from "./service.actions";
import {ServiceRepository} from "@service/repository/service.repository";

export interface IServiceState {
  list: {
    filters: {
      search: undefined | string;
    },
    pagination: Pagination<Service.IService>,
    loading: boolean;
    items: Service.IService[];
    total: number;
  };
  item: {
    loading: boolean;
    data: undefined | Service.IService
  };
}

@State<IServiceState>({
  name: 'service',
  defaults: {
    item: {
      loading: false,
      data: undefined,
    },
    list: {
      filters: {
        search: undefined,
      },
      loading: false,
      pagination: new Pagination<Service.IService>(),
      items: [],
      total: 0
    },
  }
})
@Injectable()
export class ServiceState {

  // TODO make base state and action!
  // TODO this is duplication customer

  public readonly router = inject(Router);
  public readonly repository = inject(ServiceRepository);

  @Action(ServiceActions.UpdateFilters)
  public async UpdateFilters(ctx: StateContext<IServiceState>, {payload}: ServiceActions.UpdateFilters): Promise<void> {

    const store = ctx.getState();

    ctx.patchState({
      list: {
        ...store.list,
        filters: payload,
      }
    });

    ctx.dispatch(new ServiceActions.UpdateQueryParamsAtNavigator());

  }

  @Action(ServiceActions.UpdateQueryParamsAtNavigator)
  public async UpdateQueryParamsAtNavigator(ctx: StateContext<IServiceState>): Promise<void> {

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

  @Action(ServiceActions.UpdatePaginationFromQueryParams)
  public UpdatePaginationFromQueryParams(ctx: StateContext<IServiceState>, {payload}: ServiceActions.UpdatePaginationFromQueryParams): void {

    const store = ctx.getState();
    const newPagination = Pagination.fromObject(store.list.pagination);
    newPagination.fromQueryParams(payload);

    ctx.patchState({
      list: {
        ...store.list,
        pagination: newPagination,
      }
    })

    ctx.dispatch(new ServiceActions.GetList());

  }

  @Action(ServiceActions.GetItem)
  public async GetItem(ctx: StateContext<IServiceState>, {payload}: ServiceActions.GetItem): Promise<void> {
    // TODO return existing data if last download of data was less then 10min and if use use "refresh" then force download new data

    ctx.patchState({
      item: {
        data: undefined,
        loading: true,
      }
    });

    const {data} = await this.repository.item(payload);

    ctx.patchState({
      item: {
        loading: false,
        data
      }
    });
  }

  @Action(ServiceActions.DeleteItem)
  public deleteItem(ctx: StateContext<IServiceState>, {payload}: ServiceActions.DeleteItem): void {
    const {id, refreshList, goToTheList} = payload;
    this.repository.remove(id).then((result) => {
      if (result) {
        if (goToTheList) {
          this.router.navigate(['/', 'service']);
        } else {
          if (refreshList ?? true) {
            ctx.dispatch(new ServiceActions.GetList());
          }
        }
      }
    });
  }

  @Action(ServiceActions.GetList)
  public async getList(ctx: StateContext<IServiceState>): Promise<void> {

    const state = ctx.getState();

    ctx.patchState({
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

    const {search} = state.list.filters;
    const filters: any = {};

    if (search) {
      filters['$or'] = [
        {
          languageVersions: {
            $elemMatch: {
              "title": {
                $regex: search ?? '',
                $options: "i"
              },
            }
          }
        },
        {
          languageVersions: {
            $elemMatch: {
              "description": {
                $regex: search ?? '',
                $options: "i"
              },
            }
          }
        },
      ];
    }

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
      list: {
        ...state.list,
        pagination: newPagination,
        items,
        total,
        loading: false,
      }
    });

  }

  // Selectors

  @Selector()
  public static list(state: IServiceState) {
    return state.list;
  }

  @Selector()
  public static itemData(state: IServiceState) {
    return state.item.data;
  }

  @Selector()
  public static itemLoading(state: IServiceState) {
    return state.item.loading;
  }

  @Selector()
  public static listItems(state: IServiceState) {
    return state.list.items;
  }

  @Selector()
  public static listLoading(state: IServiceState) {
    return state.list.loading;
  }

  @Selector()
  public static listPagination(state: IServiceState) {
    return state.list.pagination;
  }

}
