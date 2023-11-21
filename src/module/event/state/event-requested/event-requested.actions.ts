import {BaseActions} from "@utility/state/base/base.actions";
import {IEvent, RMIEvent} from "@event/domain";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace EventRequestedActions {

  export class Init extends BaseActions.Init {
    public static override readonly type = '[Event Requested State] Init';
  }

  export class GetList extends BaseActions.GetList {
    public static override readonly type = '[Event Requested API] Get List';
  }

  export class GetItem extends BaseActions.GetItem {
    public static override readonly type = '[Event Requested API] Get Item';
  }

  export class UpdateItem extends BaseActions.UpdateItem<IEvent> {
    public static override readonly type = '[Event Requested API] Update Item';
  }

  // Updates of state

  export class UpdateFilters extends BaseActions.UpdateFilters {
    public static override readonly type = '[Event Requested State] Update Filters';
  }

  export class UpdateTableState extends BaseActions.UpdateTableState<RMIEvent> {
    public static override readonly type = '[Event Requested State] Update Table State';
  }

  // Statuses

  export class CancelledStatus {
    public static readonly type = '[Event Requested API] Cancelled Status';

    constructor(
      public readonly payload: IEvent,
    ) {
    }
  }

  export class BookedStatus {
    public static readonly type = '[Event Requested API] Booked Success';

    constructor(
      public readonly payload: IEvent,
    ) {
    }
  }

}
