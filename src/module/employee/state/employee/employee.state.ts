import {inject, Injectable} from "@angular/core";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import {EmployeeActions} from "@employee/state/employee/employee.actions";
import * as Employee from "@employee/domain";
import {Router} from "@angular/router";
import {EmployeeRepository} from "@employee/repository/employee.repository";
import {Pagination} from "@utility/domain";
import {ICustomerState} from "@customer/state/customer/customer.state";

export interface IEmployeeState {
  list: {
    filters: {
      search: undefined | string;
    },
    pagination: Pagination<Employee.IEmployee>,
    loading: boolean;
    items: Employee.IEmployee[];
    total: number;
  };
  item: {
    loading: boolean;
    data: undefined | Employee.IEmployee
  };
}

@State<IEmployeeState>({
  name: 'employee',
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
      pagination: new Pagination<Employee.IEmployee>(),
      items: [],
      total: 0
    },
  }
})
@Injectable()
export class EmployeeState {

  // TODO make base state and action!
  // TODO this is duplication customer

  public readonly router = inject(Router);
  public readonly repository = inject(EmployeeRepository);

  @Action(EmployeeActions.UpdateFilters)
  public async UpdateFilters(ctx: StateContext<IEmployeeState>, {payload}: EmployeeActions.UpdateFilters): Promise<void> {

    const store = ctx.getState();

    ctx.patchState({
      list: {
        ...store.list,
        filters: payload,
      }
    });

    ctx.dispatch(new EmployeeActions.UpdateQueryParamsAtNavigator());

  }

  @Action(EmployeeActions.UpdateQueryParamsAtNavigator)
  public async UpdateQueryParamsAtNavigator(ctx: StateContext<IEmployeeState>): Promise<void> {

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

  @Action(EmployeeActions.UpdatePaginationFromQueryParams)
  public UpdatePaginationFromQueryParams(ctx: StateContext<IEmployeeState>, {payload}: EmployeeActions.UpdatePaginationFromQueryParams): void {

    const store = ctx.getState();
    const newPagination = Pagination.fromObject(store.list.pagination);
    newPagination.fromQueryParams(payload);

    ctx.patchState({
      list: {
        ...store.list,
        pagination: newPagination,
      }
    })

    ctx.dispatch(new EmployeeActions.GetList());

  }

  @Action(EmployeeActions.GetItem)
  public async GetItem(ctx: StateContext<IEmployeeState>, {payload}: EmployeeActions.GetItem): Promise<void> {

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

  @Action(EmployeeActions.DeleteItem)
  public deleteItem(ctx: StateContext<IEmployeeState>, {payload}: EmployeeActions.DeleteItem): void {
    const {id, refreshList, goToTheList} = payload;
    this.repository.remove(id).then((result) => {
      if (result) {
        if (goToTheList) {
          this.router.navigate(['/', 'employee']);
        } else {
          if (refreshList ?? true) {
            ctx.dispatch(new EmployeeActions.GetList());
          }
        }
      }
    });
  }

  @Action(EmployeeActions.GetList)
  public async getList(ctx: StateContext<IEmployeeState>): Promise<void> {

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
          secondName: {
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
  public static list(state: IEmployeeState) {
    return state.list;
  }

  @Selector()
  public static itemData(state: IEmployeeState) {
    return state.item.data;
  }

  @Selector()
  public static itemLoading(state: ICustomerState) {
    return state.item.loading;
  }

  @Selector()
  public static listItems(state: IEmployeeState) {
    return state.list.items;
  }

  @Selector()
  public static listLoading(state: IEmployeeState) {
    return state.list.loading;
  }

  @Selector()
  public static listPagination(state: IEmployeeState) {
    return state.list.pagination;
  }

}
