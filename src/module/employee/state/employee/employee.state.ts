import {inject, Injectable} from "@angular/core";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import * as Employee from "@employee/domain";
import {Router} from "@angular/router";
import {EmployeeRepository} from "@employee/repository/employee.repository";
import {Pagination} from "@utility/domain";
import {BaseState} from "@utility/state/base/base.state";
import {EmployeeActions} from "@employee/state/employee/employee.actions";

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
export class EmployeeState extends BaseState<Employee.IEmployee> {

  public override readonly router = inject(Router);
  public override readonly repository = inject(EmployeeRepository);

  constructor() {
    super(EmployeeActions);
  }

  @Action(EmployeeActions.UpdateFilters)
  public override async UpdateFilters(ctx: StateContext<IEmployeeState>, action: EmployeeActions.UpdateFilters): Promise<void> {
    await super.UpdateFilters(ctx, action);
  }

  @Action(EmployeeActions.UpdateQueryParamsAtNavigator)
  public override async UpdateQueryParamsAtNavigator(ctx: StateContext<IEmployeeState>): Promise<void> {
    await super.UpdateQueryParamsAtNavigator(ctx);
  }

  @Action(EmployeeActions.UpdatePaginationFromQueryParams)
  public override UpdatePaginationFromQueryParams(ctx: StateContext<IEmployeeState>, action: EmployeeActions.UpdatePaginationFromQueryParams): void {
    super.UpdatePaginationFromQueryParams(ctx, action);
  }

  @Action(EmployeeActions.GetItem)
  public override async GetItem(ctx: StateContext<IEmployeeState>, action: EmployeeActions.GetItem): Promise<void> {
    await super.GetItem(ctx, action);
  }

  @Action(EmployeeActions.DeleteItem)
  public override deleteItem(ctx: StateContext<IEmployeeState>, action: EmployeeActions.DeleteItem): void {
    super.deleteItem(ctx, action);
  }

  @Action(EmployeeActions.GetList)
  public override async getList(ctx: StateContext<IEmployeeState>): Promise<void> {
    await super.getList(ctx, (queryFilters: any, filters: any) => {

      const {search} = filters;


      if (search) {
        queryFilters['$or'] = [
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
  public static itemLoading(state: IEmployeeState) {
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
