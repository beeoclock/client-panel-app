import {BaseActions} from "@utility/state/base/base.actions";
import {IEvent, RMIEvent} from "@event/domain";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace RequestedEventActions {

  export class Init extends BaseActions.Init {
    public static override readonly type = '[Event State] Init';
  }

  export class InitDefaultsFromCache extends BaseActions.InitDefaultsFromCache {
    public static override readonly type = '[Event Cache] Init Defaults From Cache';
  }

  export class ClearTableCache extends BaseActions.ClearTableCache {
    public static override readonly type = '[Event Cache] Clear Table Cache';
  }

  export class ClearItemCache extends BaseActions.ClearItemCache {
    public static override readonly type = '[Event Cache] Clear Item Cache';
  }

  export class ClearTableCacheAndGetList extends BaseActions.ClearTableCacheAndGetList {
    public static override readonly type = '[Event Cache & API] Clear Table Cache And Get List';
  }

  export class ClearItemCacheAndGetItem extends BaseActions.ClearItemCacheAndGetItem {
    public static override readonly type = '[Event Cache & API] Clear Item Cache And Get Item';
  }

  export class GetList extends BaseActions.GetList {
    public static override readonly type = '[Event API] Get List';
  }

  export class GetItem extends BaseActions.GetItem {
    public static override readonly type = '[Event API] Get Item';
  }

  export class UpdateItem extends BaseActions.UpdateItem<IEvent> {
    public static override readonly type = '[Event API] Update Item';
  }

  // Updates of state

  export class UpdateFilters extends BaseActions.UpdateFilters {
    public static override readonly type = '[Event State] Update Filters';
  }

  export class UpdateTableState extends BaseActions.UpdateTableState<RMIEvent> {
    public static override readonly type = '[Event State] Update Table State';
  }

  // Statuses

  export class CancelledStatus {
    public static readonly type = '[Event API] Cancelled Status';

    constructor(
      public readonly payload: IEvent,
    ) {
    }
  }

  export class BookedStatus {
    public static readonly type = '[Event API] Booked Success';

    constructor(
      public readonly payload: IEvent,
    ) {
    }
  }

}
