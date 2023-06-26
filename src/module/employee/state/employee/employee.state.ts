import {inject, Injectable} from "@angular/core";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import * as Employee from "@employee/domain";
import {Router} from "@angular/router";
import {EmployeeRepository} from "@employee/repository/employee.repository";
import {baseDefaults, BaseState, IBaseState} from "@utility/state/base/base.state";
import {EmployeeActions} from "@employee/state/employee/employee.actions";

export type IEmployeeState = IBaseState<Employee.IEmployee>;

@State<IEmployeeState>({
  name: 'employee',
  defaults: baseDefaults<Employee.IEmployee>()
})
@Injectable()
export class EmployeeState extends BaseState<Employee.IEmployee> {

  public override readonly router = inject(Router);
  public override readonly repository = inject(EmployeeRepository);

  constructor() {
    super(
      EmployeeActions,
      {
        tableStates: 'employee.cache.tableStates',
        items: 'employee.cache.items'
      }
    );
  }

  @Action(EmployeeActions.InitDefaultsFromCache)
  public override async InitDefaultsFromCache(ctx: StateContext<IEmployeeState>): Promise<void> {
    await super.InitDefaultsFromCache(ctx);
  }

  @Action(EmployeeActions.UpdateFilters)
  public override async UpdateFilters(ctx: StateContext<IEmployeeState>, action: EmployeeActions.UpdateFilters): Promise<void> {
    await super.UpdateFilters(ctx, action);
  }

  @Action(EmployeeActions.UpdateTableState)
  public override async UpdateTableState(ctx: StateContext<IEmployeeState>, action: EmployeeActions.UpdateTableState): Promise<void> {
    return super.UpdateTableState(ctx, action);
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
  public static itemData(state: IEmployeeState) {
    return state.item.data;
  }

  @Selector()
  public static tableStateItems(state: IEmployeeState) {
    return state.tableState.items;
  }

  @Selector()
  public static tableState(state: IEmployeeState) {
    return state.tableState;
  }

}
