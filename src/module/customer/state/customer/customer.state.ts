import {inject, Injectable} from "@angular/core";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import {CustomerActions} from "@customer/state/customer/customer.actions";
import * as Customer from "@customer/domain";
import {Router} from "@angular/router";
import {CustomerRepository} from "@customer/repository/customer.repository";
import {Pagination} from "@utility/domain";
import {NotImplementedYetError} from "@utility/domain/error";

interface ICustomerState {
  list: {
    filters: {
      search: undefined | string;
    },
    pagination: Pagination<Customer.ICustomer>,
    loading: boolean;
    items: Customer.ICustomer[];
    total: number;
  };
}

@State<ICustomerState>({
  name: 'customer',
  defaults: {
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

  @Action(CustomerActions.UpdateQueryParamsAtNavigator)
  public async UpdateQueryParamsAtNavigator(ctx: StateContext<ICustomerState>): Promise<void> {

    const store = ctx.getState();

    await this.router.navigate([], {
      queryParams: store.list.pagination.toQueryParams(),
      queryParamsHandling: "merge",
      replaceUrl: true
    });

  }

  @Action(CustomerActions.UpdatePaginationFromQueryParams)
  public UpdatePaginationFromQueryParams(ctx: StateContext<ICustomerState>, {payload}: CustomerActions.UpdatePaginationFromQueryParams): void {

    const state = ctx.getState();
    const newPagination = Pagination.fromObject(state.list.pagination);
    newPagination.fromQueryParams(payload);

    ctx.patchState({
      list: {
        ...state.list,
        pagination: newPagination,
      }
    })

    ctx.dispatch(new CustomerActions.GetList());

  }

  @Action(CustomerActions.GetItem)
  public GetItem(ctx: StateContext<ICustomerState>, {payload}: CustomerActions.GetItem): void {
    throw new NotImplementedYetError();
  }

  @Action(CustomerActions.DeleteItem)
  public deleteItem(ctx: StateContext<ICustomerState>, {payload}: CustomerActions.GetItem): void {
    throw new NotImplementedYetError();
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

    ctx.patchState({
      list: {
        ...state.list,
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
