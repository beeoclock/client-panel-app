import {inject, Injectable} from "@angular/core";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import * as Event from "@event/domain";
import {Router} from "@angular/router";
import {EventRepository} from "@event/repository/event.repository";
import {baseDefaults, BaseState, IBaseState} from "@utility/state/base/base.state";
import {EventActions} from "@event/state/event/event.actions";

export type IEventState = IBaseState<Event.IEvent>;

@State<IEventState>({
  name: 'event',
  defaults: baseDefaults<Event.IEvent>()
})
@Injectable()
export class EventState extends BaseState<Event.IEvent> {

  public override readonly router = inject(Router);
  public override readonly repository = inject(EventRepository);

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

  @Action(EventActions.SaveItem)
  public override async saveItem(ctx: StateContext<IEventState>, action: EventActions.SaveItem): Promise<void> {
    await super.saveItem(ctx, action);
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
