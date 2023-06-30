import {BaseActions} from "@utility/state/base/base.actions";
import {IMember} from "@member/domain";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace MemberActions {

  export class InitDefaultsFromCache extends BaseActions.InitDefaultsFromCache {
    public static override readonly type = '[Member API] Init Defaults From Cache';
  }

  export class GetList extends BaseActions.GetList {
    public static override readonly type = '[Member API] Get List';
  }

  export class DeleteItem extends BaseActions.DeleteItem {
    public static override readonly type = '[Member API] Delete Item';
  }

  export class ArchiveItem extends BaseActions.ArchiveItem {
    public static override readonly type = '[Member API] Archive Item';
  }

  export class GetItem extends BaseActions.GetItem {
    public static override readonly type = '[Member API] Get Item';
  }

  // Updates of state

  export class UpdateFilters extends BaseActions.UpdateFilters {
    public static override readonly type = '[Member State] Update Filters';
  }

  export class UpdateTableState extends BaseActions.UpdateTableState<IMember> {
    public static override readonly type = '[Member State] Update Table State';
  }

}
