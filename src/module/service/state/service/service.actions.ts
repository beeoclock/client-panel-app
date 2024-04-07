import {BaseActions} from "@utility/state/base/base.actions";
import {IService} from "@service/domain";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ServiceActions {

  export class Init extends BaseActions.Init {
    public static override readonly type = '[Service State] Init';
  }

  export class GetList extends BaseActions.GetList {
    public static override readonly type = '[Service API] Get List';
  }

  export class DeleteItem extends BaseActions.DeleteItem {
    public static override readonly type = '[Service API] Delete Item';
  }

  export class ArchiveItem extends BaseActions.ArchiveItem {
    public static override readonly type = '[Service API] Archive Item';
  }

  export class UnarchiveItem extends BaseActions.UnarchiveItem {
    public static override readonly type = '[Service API] Unarchive Item';
  }

  export class GetItem extends BaseActions.GetItem {
    public static override readonly type = '[Service API] Get Item';
  }

  export class CreateItem extends BaseActions.CreateItem<IService> {
    public static override readonly type = '[Service API] Create Item';
  }

  export class UpdateItem extends BaseActions.UpdateItem<IService> {
    public static override readonly type = '[Service API] Update Item';
  }

  // Updates of state

  export class UpdateFilters extends BaseActions.UpdateFilters {
    public static override readonly type = '[Service State] Update Filters';
  }

  export class UpdateTableState extends BaseActions.UpdateTableState<IService> {
    public static override readonly type = '[Service State] Update Table State';
  }

}
