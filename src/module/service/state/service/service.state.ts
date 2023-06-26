import {inject, Injectable} from "@angular/core";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import * as Service from "@service/domain";
import {IService} from "@service/domain";
import {Router} from "@angular/router";
import {ServiceRepository} from "@service/repository/service.repository";
import {baseDefaults, BaseState, IBaseState} from "@utility/state/base/base.state";
import {ServiceActions} from "@service/state/service/service.actions";

export type IServiceState = IBaseState<Service.IService>

@State<IServiceState>({
  name: 'service',
  defaults: baseDefaults<Service.IService>()
})
@Injectable()
export class ServiceState extends BaseState<IService> {

  public override readonly router = inject(Router);
  public override readonly repository = inject(ServiceRepository);

  constructor() {
    super(
      ServiceActions,
      {
        tableStates: 'service.cache.tableStates',
        items: 'service.cache.items'
      }
    );
  }

  @Action(ServiceActions.InitDefaultsFromCache)
  public override async InitDefaultsFromCache(ctx: StateContext<IServiceState>): Promise<void> {
    await super.InitDefaultsFromCache(ctx);
  }

  @Action(ServiceActions.UpdateFilters)
  public override async UpdateFilters(ctx: StateContext<IServiceState>, action: ServiceActions.UpdateFilters): Promise<void> {
    await super.UpdateFilters(ctx, action);
  }

  @Action(ServiceActions.UpdateTableState)
  public override async UpdateTableState(ctx: StateContext<IServiceState>, action: ServiceActions.UpdateTableState): Promise<void> {
    return super.UpdateTableState(ctx, action);
  }

  @Action(ServiceActions.GetItem)
  public override async GetItem(ctx: StateContext<IServiceState>, action: ServiceActions.GetItem): Promise<void> {
    await super.GetItem(ctx, action);
  }

  @Action(ServiceActions.DeleteItem)
  public override deleteItem(ctx: StateContext<IServiceState>, action: ServiceActions.DeleteItem): void {
    super.deleteItem(ctx, action);
  }

  @Action(ServiceActions.GetList)
  public override async getList(ctx: StateContext<IServiceState>): Promise<void> {
    await super.getList(ctx, (queryFilters: any, filters: any) => {

      const {search} = filters;

      if (search) {
        queryFilters['$or'] = [
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

    });

  }

  // Selectors

  @Selector()
  public static itemData(state: IServiceState) {
    return state.item.data;
  }

  @Selector()
  public static tableStateItems(state: IServiceState) {
    return state.tableState.items;
  }

  @Selector()
  public static tableState(state: IServiceState) {
    return state.tableState;
  }

}
