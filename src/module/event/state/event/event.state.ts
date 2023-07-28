import {inject, Injectable} from "@angular/core";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import * as Event from "@event/domain";
import {baseDefaults, BaseState, IBaseState} from "@utility/state/base/base.state";
import {EventActions} from "@event/state/event/event.actions";
import {ArchiveEventApiAdapter} from "@event/adapter/external/api/archive.event.api.adapter";
import {CreateEventApiAdapter} from "@event/adapter/external/api/create.event.api.adapter";
import {UpdateEventApiAdapter} from "@event/adapter/external/api/update.event.api.adapter";
import {ItemEventApiAdapter} from "@event/adapter/external/api/item.event.api.adapter";
import {ListEventApiAdapter} from "@event/adapter/external/api/list.event.api.adapter";
import {RemoveEventApiAdapter} from "@event/adapter/external/api/remove.event.api.adapter";

export type IEventState = IBaseState<Event.IEvent>;

@State<IEventState>({
  name: 'event',
  defaults: baseDefaults<Event.IEvent>()
})
@Injectable()
export class EventState extends BaseState<Event.IEvent> {

  private readonly archiveEventApiAdapter = inject(ArchiveEventApiAdapter);
  private readonly createEventApiAdapter = inject(CreateEventApiAdapter);
  private readonly updateEventApiAdapter = inject(UpdateEventApiAdapter);
  private readonly itemEventApiAdapter = inject(ItemEventApiAdapter);
  private readonly removeEventApiAdapter = inject(RemoveEventApiAdapter);
  private readonly listEventApiAdapter = inject(ListEventApiAdapter);

  public override readonly repository = {
    item: this.itemEventApiAdapter.executeAsync,
    update: this.updateEventApiAdapter.executeAsync,
    create: this.createEventApiAdapter.executeAsync,
    remove: this.removeEventApiAdapter.executeAsync,
    archive: this.archiveEventApiAdapter.executeAsync,
    list: this.listEventApiAdapter.executeAsync,
  };

  constructor() {
    super(
      EventActions,
      {
        tableStates: 'event.cache.tableStates',
        items: 'event.cache.items'
      }
    );
  }

  @Action(EventActions.Init)
  public override async init(ctx: StateContext<IEventState>): Promise<void> {
    await super.init(ctx);
  }

  @Action(EventActions.InitDefaultsFromCache)
  public override async InitDefaultsFromCache(ctx: StateContext<IEventState>): Promise<void> {
    await super.InitDefaultsFromCache(ctx);
  }

  @Action(EventActions.ClearTableCache)
  public override async ClearTableCache(ctx: StateContext<IEventState>): Promise<void> {
    await super.ClearTableCache(ctx);
  }

  @Action(EventActions.ClearItemCache)
  public override async ClearItemCache(ctx: StateContext<IEventState>): Promise<void> {
    await super.ClearItemCache(ctx);
  }

  @Action(EventActions.ClearTableCacheAndGetList)
  public override async ClearTableCacheAndGetList(ctx: StateContext<IEventState>): Promise<void> {
    await super.ClearTableCacheAndGetList(ctx);
  }

  @Action(EventActions.ClearItemCacheAndGetItem)
  public override async ClearItemCacheAndGetItem(ctx: StateContext<IEventState>): Promise<void> {
    await super.ClearItemCacheAndGetItem(ctx);
  }

  @Action(EventActions.UpdateFilters)
  public override async UpdateFilters(ctx: StateContext<IEventState>, action: EventActions.UpdateFilters): Promise<void> {
    await super.UpdateFilters(ctx, action);
  }

  @Action(EventActions.UpdateTableState)
  public override async UpdateTableState(ctx: StateContext<IEventState>, action: EventActions.UpdateTableState): Promise<void> {
    return super.UpdateTableState(ctx, action);
  }

  @Action(EventActions.GetItem)
  public override async GetItem(ctx: StateContext<IEventState>, action: EventActions.GetItem): Promise<void> {
    await super.GetItem(ctx, action);
  }

  @Action(EventActions.DeleteItem)
  public override deleteItem(ctx: StateContext<IEventState>, action: EventActions.DeleteItem): void {
    super.deleteItem(ctx, action);
  }

  @Action(EventActions.CreateItem)
  public override async createItem(ctx: StateContext<IEventState>, action: EventActions.CreateItem): Promise<void> {
    await super.createItem(ctx, action);
  }

  @Action(EventActions.UpdateItem)
  public override async updateItem(ctx: StateContext<IEventState>, action: EventActions.UpdateItem): Promise<void> {
    await super.updateItem(ctx, action);
  }

  @Action(EventActions.GetList)
  public override async getList(ctx: StateContext<IEventState>): Promise<void> {
    await super.getList(ctx, (queryFilters: any, filters: any) => {

      const {search} = filters;


      if (search) {
        queryFilters['$or'] = [
          {
            title: {
              $regex: search ?? '',
              $options: "i"
            }
          },
          {
            description: {
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
  public static itemData(state: IEventState) {
    return state.item.data;
  }

  @Selector()
  public static tableStateItems(state: IEventState) {
    return state.tableState.items;
  }

  @Selector()
  public static tableState(state: IEventState) {
    return state.tableState;
  }

}
