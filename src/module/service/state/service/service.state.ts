import {inject, Injectable} from "@angular/core";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import * as Service from "@service/domain";
import {IService} from "@service/domain";
import {Router} from "@angular/router";
import {ServiceRepository} from "@service/repository/service.repository";
import {baseDefaults, BaseState, IBaseState} from "@utility/state/base/base.state";
import {ServiceActions} from "@service/state/service/service.actions";
import {Observable} from "rxjs";

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
    super(ServiceActions);
  }

  @Action(ServiceActions.InitDefaultsFromCache)
  public override async InitDefaultsFromCache(ctx: StateContext<IServiceState>): Promise<void> {
    await super.InitDefaultsFromCache(ctx);
  }

  @Action(ServiceActions.UpdateFilters)
  public override async UpdateFilters(ctx: StateContext<IServiceState>, action: ServiceActions.UpdateFilters): Promise<void> {
    await super.UpdateFilters(ctx, action);
  }

  @Action(ServiceActions.UpdateQueryParamsAtNavigator)
  public override async UpdateQueryParamsAtNavigator(ctx: StateContext<IServiceState>, action: ServiceActions.UpdateQueryParamsAtNavigator): Promise<void> {
    await super.UpdateQueryParamsAtNavigator(ctx, action);
  }

  @Action(ServiceActions.UpdatePaginationFromQueryParams)
  public override UpdatePaginationFromQueryParams(ctx: StateContext<IServiceState>, action: ServiceActions.UpdatePaginationFromQueryParams): Observable<any> {
    return super.UpdatePaginationFromQueryParams(ctx, action);
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
  public static list(state: IServiceState) {
    return state.list;
  }

  @Selector()
  public static itemData(state: IServiceState) {
    return state.item.data;
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
