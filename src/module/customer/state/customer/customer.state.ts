import {inject, Injectable} from "@angular/core";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import {Router} from "@angular/router";
import {Pagination} from "@utility/domain";
import {BaseState, IBaseState} from "@utility/state/base/base.state";
import {EmployeeRepository} from "@employee/repository/employee.repository";
import * as Customer from "@customer/domain";
import {CustomerActions} from "@customer/state/customer/customer.actions";
import {Observable} from "rxjs";

export type ICustomerState = IBaseState<Customer.ICustomer>;

@State<ICustomerState>({
  name: 'customer',
  defaults: {
    item: {
      loading: false,
      data: undefined,
    },
    list: {
      initialized: false,
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
export class CustomerState extends BaseState<Customer.ICustomer> {

  public override readonly router = inject(Router);
  public override readonly repository = inject(EmployeeRepository);

  constructor() {
    super(CustomerActions);
  }

  @Action(CustomerActions.UpdateFilters)
  public override async UpdateFilters(ctx: StateContext<ICustomerState>, action: CustomerActions.UpdateFilters): Promise<void> {
    await super.UpdateFilters(ctx, action);
  }

  @Action(CustomerActions.UpdateQueryParamsAtNavigator)
  public override async UpdateQueryParamsAtNavigator(ctx: StateContext<ICustomerState>, action: CustomerActions.UpdateQueryParamsAtNavigator): Promise<void> {
    await super.UpdateQueryParamsAtNavigator(ctx, action);
  }

  @Action(CustomerActions.UpdatePaginationFromQueryParams)
  public override UpdatePaginationFromQueryParams(ctx: StateContext<ICustomerState>, action: CustomerActions.UpdatePaginationFromQueryParams): Observable<any> {
    return super.UpdatePaginationFromQueryParams(ctx, action);
  }

  @Action(CustomerActions.GetItem)
  public override async GetItem(ctx: StateContext<ICustomerState>, action: CustomerActions.GetItem): Promise<void> {
    await super.GetItem(ctx, action);
  }

  @Action(CustomerActions.DeleteItem)
  public override deleteItem(ctx: StateContext<ICustomerState>, action: CustomerActions.DeleteItem): void {
    super.deleteItem(ctx, action);
  }

  @Action(CustomerActions.GetList)
  public override async getList(ctx: StateContext<ICustomerState>): Promise<void> {
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

    });

  }

  // Selectors

  @Selector()
  public static list(state: ICustomerState) {
    return state.list;
  }

  @Selector()
  public static itemData(state: ICustomerState) {
    return state.item.data;
  }

  @Selector()
  public static itemLoading(state: ICustomerState) {
    return state.item.loading;
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
