import {inject, Injectable} from "@angular/core";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import {EventActions} from "@event/state/event/event.actions";
import * as Event from "@event/domain";
import {Router} from "@angular/router";
import {EventRepository} from "@event/repository/event.repository";
import {Pagination} from "@utility/domain";

export interface IEventState {
  list: {
    filters: {
      search: undefined | string;
    },
    pagination: Pagination<Event.IEvent>,
    loading: boolean;
    items: Event.IEvent[];
    total: number;
  };
  item: undefined | Event.IEvent;
}

@State<IEventState>({
  name: 'event',
  defaults: {
    item: undefined,
    list: {
      filters: {
        search: undefined,
      },
      loading: false,
      pagination: new Pagination<Event.IEvent>(),
      items: [],
      total: 0
    },
  }
})
@Injectable()
export class EventState {

  // TODO make base state and action!
  // TODO this is duplication customer

  public readonly router = inject(Router);
  public readonly repository = inject(EventRepository);

  @Action(EventActions.UpdateFilters)
  public async UpdateFilters(ctx: StateContext<IEventState>, {payload}: EventActions.UpdateFilters): Promise<void> {

    const store = ctx.getState();

    ctx.patchState({
      list: {
        ...store.list,
        filters: payload,
      }
    });

    ctx.dispatch(new EventActions.UpdateQueryParamsAtNavigator());

  }

  @Action(EventActions.UpdateQueryParamsAtNavigator)
  public async UpdateQueryParamsAtNavigator(ctx: StateContext<IEventState>): Promise<void> {

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

  @Action(EventActions.UpdatePaginationFromQueryParams)
  public UpdatePaginationFromQueryParams(ctx: StateContext<IEventState>, {payload}: EventActions.UpdatePaginationFromQueryParams): void {

    const store = ctx.getState();
    const newPagination = Pagination.fromObject(store.list.pagination);
    newPagination.fromQueryParams(payload);

    ctx.patchState({
      list: {
        ...store.list,
        pagination: newPagination,
      }
    })

    ctx.dispatch(new EventActions.GetList());

  }

  @Action(EventActions.GetItem)
  public async GetItem(ctx: StateContext<IEventState>, {payload}: EventActions.GetItem): Promise<void> {
    // TODO return existing data if last download of data was less then 10min and if use use "refresh" then force download new data
    const {data} = await this.repository.item(payload);
    ctx.patchState({
      item: data
    });
  }

  @Action(EventActions.DeleteItem)
  public deleteItem(ctx: StateContext<IEventState>, {payload}: EventActions.DeleteItem): void {
    const {id, refreshList, goToTheList} = payload;
    this.repository.remove(id).then((result) => {
      if (result) {
        if (goToTheList) {
          this.router.navigate(['/', 'event']);
        } else {
          if (refreshList ?? true) {
            ctx.dispatch(new EventActions.GetList());
          }
        }
      }
    });
  }

  @Action(EventActions.GetList)
  public async getList(ctx: StateContext<IEventState>): Promise<void> {

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
  public static list(state: IEventState) {
    return state.list;
  }

  @Selector()
  public static item(state: IEventState) {
    return state.item;
  }

  @Selector()
  public static listItems(state: IEventState) {
    return state.list.items;
  }

  @Selector()
  public static listLoading(state: IEventState) {
    return state.list.loading;
  }

  @Selector()
  public static listPagination(state: IEventState) {
    return state.list.pagination;
  }

}
