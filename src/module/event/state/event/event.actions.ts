import {BaseActions} from "@utility/state/base/base.actions";
import {IEvent} from "@event/domain";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace EventActions {

  export class Init extends BaseActions.Init {
    public static override readonly type = '[Event State] Init';
  }

  export class InitDefaultsFromCache extends BaseActions.InitDefaultsFromCache {
    public static override readonly type = '[Event Cache] Init Defaults From Cache';
  }

  export class GetList extends BaseActions.GetList {
    public static override readonly type = '[Event API] Get List';
  }

  export class DeleteItem extends BaseActions.DeleteItem {
    public static override readonly type = '[Event API] Delete Item';
  }

  export class ArchiveItem extends BaseActions.ArchiveItem {
    public static override readonly type = '[Event API] Archive Item';
  }

  export class GetItem extends BaseActions.GetItem {
    public static override readonly type = '[Event API] Get Item';
  }

  export class SaveItem extends BaseActions.SaveItem<IEvent> {
    public static override readonly type = '[Event API] Save Item';
  }

  // Updates of state

  export class UpdateFilters extends BaseActions.UpdateFilters {
    public static override readonly type = '[Event State] Update Filters';
  }

  export class UpdateTableState extends BaseActions.UpdateTableState<IEvent> {
    public static override readonly type = '[Event State] Update Table State';
  }

}
