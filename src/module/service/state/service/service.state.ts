import {inject, Injectable} from "@angular/core";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import * as Service from "@service/domain";
import {IService} from "@service/domain";
import {baseDefaults, BaseState, IBaseState} from "@utility/state/base/base.state";
import {ArchiveServiceApiAdapter} from "@service/adapter/external/api/archive.service.api.adapter";
import {CreateServiceApiAdapter} from "@service/adapter/external/api/create.service.api.adapter";
import {UpdateServiceApiAdapter} from "@service/adapter/external/api/update.service.api.adapter";
import {ItemServiceApiAdapter} from "@service/adapter/external/api/item.service.api.adapter";
import {RemoveServiceApiAdapter} from "@service/adapter/external/api/remove.service.api.adapter";
import {ListServiceApiAdapter} from "@service/adapter/external/api/list.service.api.adapter";
import {ServiceActions} from "@service/state/service/service.actions";

export type IServiceState = IBaseState<Service.IService>

@State<IServiceState>({
  name: 'service',
  defaults: baseDefaults<Service.IService>()
})
@Injectable()
export class ServiceState extends BaseState<IService> {

  protected override readonly archive = inject(ArchiveServiceApiAdapter);
  protected override readonly create = inject(CreateServiceApiAdapter);
  protected override readonly update = inject(UpdateServiceApiAdapter);
  protected override readonly item = inject(ItemServiceApiAdapter);
  protected override readonly remove = inject(RemoveServiceApiAdapter);
  protected override readonly list = inject(ListServiceApiAdapter);

  constructor() {
    super(
      ServiceActions,
      {
        tableStates: 'service.cache.tableStates',
        items: 'service.cache.items'
      }
    );
  }

  @Action(ServiceActions.Init)
  public override async init(ctx: StateContext<IServiceState>): Promise<void> {
    await super.init(ctx);
  }

  @Action(ServiceActions.InitDefaultsFromCache)
  public override async InitDefaultsFromCache(ctx: StateContext<IServiceState>): Promise<void> {
    await super.InitDefaultsFromCache(ctx);
  }

  @Action(ServiceActions.ClearTableCache)
  public override async ClearTableCache(ctx: StateContext<IServiceState>): Promise<void> {
    await super.ClearTableCache(ctx);
  }

  @Action(ServiceActions.ClearItemCache)
  public override async ClearItemCache(ctx: StateContext<IServiceState>): Promise<void> {
    await super.ClearItemCache(ctx);
  }

  @Action(ServiceActions.ClearTableCacheAndGetList)
  public override async ClearTableCacheAndGetList(ctx: StateContext<IServiceState>): Promise<void> {
    await super.ClearTableCacheAndGetList(ctx);
  }

  @Action(ServiceActions.ClearItemCacheAndGetItem)
  public override async ClearItemCacheAndGetItem(ctx: StateContext<IServiceState>): Promise<void> {
    await super.ClearItemCacheAndGetItem(ctx);
  }

  @Action(ServiceActions.UpdateFilters)
  public override updateFilters(ctx: StateContext<IServiceState>, action: ServiceActions.UpdateFilters) {
    super.updateFilters(ctx, action);
  }

  @Action(ServiceActions.UpdateTableState)
  public override updateTableState(ctx: StateContext<IServiceState>, action: ServiceActions.UpdateTableState) {
    super.updateTableState(ctx, action);
  }

  @Action(ServiceActions.CreateItem)
  public override async createItem(ctx: StateContext<IServiceState>, action: ServiceActions.CreateItem): Promise<void> {
    await super.createItem(ctx, action);
  }

  @Action(ServiceActions.UpdateItem)
  public override async updateItem(ctx: StateContext<IServiceState>, action: ServiceActions.UpdateItem): Promise<void> {
    await super.updateItem(ctx, action);
  }

  @Action(ServiceActions.GetItem)
  public override async getItem(ctx: StateContext<IServiceState>, action: ServiceActions.GetItem): Promise<void> {
    await super.getItem(ctx, action);
  }

  @Action(ServiceActions.DeleteItem)
  public override async deleteItem(ctx: StateContext<IServiceState>, action: ServiceActions.DeleteItem) {
    await super.deleteItem(ctx, action);
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
