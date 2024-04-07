import {BaseActions} from "@utility/state/base/base.actions";
import {ICustomer} from "@customer/domain";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace CustomerActions {

  export class Init extends BaseActions.Init {
    public static override readonly type = '[Customer State] Init';
  }

  export class GetList extends BaseActions.GetList {
    public static override readonly type = '[Customer API] Get List';
  }

  export class DeleteItem extends BaseActions.DeleteItem {
    public static override readonly type = '[Customer API] Delete Item';
  }

  export class GetItem extends BaseActions.GetItem {
    public static override readonly type = '[Customer API] Get Item';
  }

  export class CreateItem extends BaseActions.CreateItem<ICustomer> {
    public static override readonly type = '[Customer API] Create Item';
  }

  export class UpdateItem extends BaseActions.UpdateItem<ICustomer> {
    public static override readonly type = '[Customer API] Update Item';
  }

  export class ArchiveItem extends BaseActions.ArchiveItem {
    public static override readonly type = '[Customer API] Archive Item';
  }

  // Updates of state

  export class UpdateFilters extends BaseActions.UpdateFilters {
    public static override readonly type = '[Customer State] Update Filters';
  }

  export class UpdateTableState extends BaseActions.UpdateTableState<ICustomer> {
    public static override readonly type = '[Customer State] Update Table State';
  }

}
