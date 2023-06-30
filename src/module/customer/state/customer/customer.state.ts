import {inject, Injectable} from "@angular/core";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import {Router} from "@angular/router";
import {baseDefaults, BaseState, IBaseState} from "@utility/state/base/base.state";
import * as Customer from "@customer/domain";
import {CustomerActions} from "@customer/state/customer/customer.actions";
import {CustomerRepository} from "@customer/repository/customer.repository";

export type ICustomerState = IBaseState<Customer.ICustomer>;

@State<ICustomerState>({
  name: 'customer',
  defaults: baseDefaults<Customer.ICustomer>()
})
@Injectable()
export class CustomerState extends BaseState<Customer.ICustomer> {

  public override readonly router = inject(Router);
  public override readonly repository = inject(CustomerRepository);

  constructor() {
    super(
      CustomerActions,
      {
        tableStates: 'customer.cache.tableStates',
        items: 'customer.cache.items'
      }
    );
  }

  @Action(CustomerActions.InitDefaultsFromCache)
  public override async InitDefaultsFromCache(ctx: StateContext<ICustomerState>): Promise<void> {
    await super.InitDefaultsFromCache(ctx);
  }

  @Action(CustomerActions.UpdateFilters)
  public override async UpdateFilters(ctx: StateContext<ICustomerState>, action: CustomerActions.UpdateFilters): Promise<void> {
    await super.UpdateFilters(ctx, action);
  }

  @Action(CustomerActions.UpdateTableState)
  public override async UpdateTableState(ctx: StateContext<ICustomerState>, action: CustomerActions.UpdateTableState): Promise<void> {
    return super.UpdateTableState(ctx, action);
  }

  @Action(CustomerActions.GetItem)
  public override async GetItem(ctx: StateContext<ICustomerState>, action: CustomerActions.GetItem): Promise<void> {
    await super.GetItem(ctx, action);
  }

  @Action(CustomerActions.SaveItem)
  public override async saveItem(ctx: StateContext<ICustomerState>, action: CustomerActions.SaveItem): Promise<void> {
    await super.saveItem(ctx, action);
  }

  @Action(CustomerActions.DeleteItem)
  public override deleteItem(ctx: StateContext<ICustomerState>, action: CustomerActions.DeleteItem): void {
    super.deleteItem(ctx, action);
  }

  @Action(CustomerActions.ArchiveItem)
  public override archiveItem(ctx: StateContext<ICustomerState>, action: CustomerActions.ArchiveItem): void {
    super.archiveItem(ctx, action);
  }

  @Action(CustomerActions.GetList)
  public override async getList(ctx: StateContext<ICustomerState>): Promise<void> {
    await super.getList(ctx, (queryFilters: any, filters: any) => {

      const {search, ...rest} = filters;

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

      Object.keys(rest).forEach((key) => {
        queryFilters['$and'] = [
          {
            [key]: filters[key]
          }
        ]
      });

    });

  }

  // Selectors

  @Selector()
  public static itemData(state: ICustomerState) {
    return state.item.data;
  }

  @Selector()
  public static tableStateItems(state: ICustomerState) {
    return state.tableState.items;
  }

  @Selector()
  public static tableState(state: ICustomerState) {
    return state.tableState;
  }

}
