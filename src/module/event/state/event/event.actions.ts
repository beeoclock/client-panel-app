import {BaseActions} from "@utility/state/base/base.actions";
import {IEvent} from "@event/domain";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace EventActions {

  export class InitDefaultsFromCache extends BaseActions.InitDefaultsFromCache {
    public static override readonly type = '[Event API] Init Defaults From Cache';
  }

  export class GetList extends BaseActions.GetList {
    public static override readonly type = '[Event API] Get List';
  }

  export class DeleteItem extends BaseActions.DeleteItem {
    public static override readonly type = '[Event API] Delete Item';
  }

  export class GetItem extends BaseActions.GetItem {
    public static override readonly type = '[Event API] Get Item';
  }

  // Updates of state

  export class UpdateFilters extends BaseActions.UpdateFilters {
    public static override readonly type = '[Event State] Update Filters';
  }

  export class UpdateTableState extends BaseActions.UpdateTableState<IEvent> {
    public static override readonly type = '[Event State] Update Table State';
  }

}
