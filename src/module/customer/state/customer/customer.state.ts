import {inject, Injectable} from "@angular/core";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import {CustomerActions} from "@customer/state/customer/customer.actions";
import * as Customer from "@customer/domain";
import {Router} from "@angular/router";
import {CustomerRepository} from "@customer/repository/customer.repository";
import {Pagination} from "@utility/domain";

export interface ICustomerState {
  list: {
    filters: {
      search: undefined | string;
    },
    pagination: Pagination<Customer.ICustomer>,
    loading: boolean;
    items: Customer.ICustomer[];
    total: number;
  };
  item: undefined | Customer.ICustomer;
}

@State<ICustomerState>({
  name: 'customer',
  defaults: {
    item: undefined,
    list: {
      filters: {
        search: undefined,
      },
      loading: false,
      pagination: new Pagination<Customer.ICustomer>(),
      items: [],
      total: 0
    },
  }
})
@Injectable()
export class CustomerState {

  public readonly router = inject(Router);
  public readonly repository = inject(CustomerRepository);

  @Action(CustomerActions.UpdateFilters)
  public async UpdateFilters(ctx: StateContext<ICustomerState>, {payload}: CustomerActions.UpdateFilters): Promise<void> {

    const store = ctx.getState();

    ctx.patchState({
      list: {
        ...store.list,
        filters: payload,
      }
    });

    ctx.dispatch(new CustomerActions.UpdateQueryParamsAtNavigator());

  }

  @Action(CustomerActions.UpdateQueryParamsAtNavigator)
  public async UpdateQueryParamsAtNavigator(ctx: StateContext<ICustomerState>): Promise<void> {

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

  @Action(CustomerActions.UpdatePaginationFromQueryParams)
  public UpdatePaginationFromQueryParams(ctx: StateContext<ICustomerState>, {payload}: CustomerActions.UpdatePaginationFromQueryParams): void {

    const store = ctx.getState();
    const newPagination = Pagination.fromObject(store.list.pagination);
    newPagination.fromQueryParams(payload);

    ctx.patchState({
      list: {
        ...store.list,
        pagination: newPagination,
      }
    })

    ctx.dispatch(new CustomerActions.GetList());

  }

  @Action(CustomerActions.GetItem)
  public async GetItem(ctx: StateContext<ICustomerState>, {payload}: CustomerActions.GetItem): Promise<void> {
    const {data} = await this.repository.item(payload);
    ctx.patchState({
      item: data
    });
  }

  @Action(CustomerActions.DeleteItem)
  public deleteItem(ctx: StateContext<ICustomerState>, {payload}: CustomerActions.DeleteItem): void {
    const {id, refreshList, goToTheList} = payload;
    this.repository.remove(id).then((result) => {
      if (result) {
        if (goToTheList) {
          this.router.navigate(['/', 'customer']);
        } else {
          if (refreshList ?? true) {
            ctx.dispatch(new CustomerActions.GetList());
          }
        }
      }
    });
  }

  @Action(CustomerActions.GetList)
  public async getList(ctx: StateContext<ICustomerState>): Promise<void> {

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
          firstName: {
            $regex: search ?? '',
            $options: "i"
          }
        },
        {
          lastName: {
            $regex: search ?? '',
            $options: "i"
          }
        },
        {
          email: {
            $regex: search ?? '',
            $options: "i"
          }
        },
        {
          phone: {
            $regex: search ?? '',
            $options: "i"
          }
        },
        {
          note: {
            $regex: search ?? '',
            $options: "i"
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
  public static list(state: ICustomerState) {
    return state.list;
  }

  @Selector()
  public static item(state: ICustomerState) {
    return state.item;
  }

  @Selector()
  public static listItems(state: ICustomerState) {
    return state.list.items;
  }

  @Selector()
  public static listLoading(state: ICustomerState) {
    return state.list.loading;
  }

  @Selector()
  public static listPagination(state: ICustomerState) {
    return state.list.pagination;
  }

}
