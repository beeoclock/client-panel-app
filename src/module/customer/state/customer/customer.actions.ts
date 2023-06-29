import {BaseActions} from "@utility/state/base/base.actions";
import {ICustomer} from "@customer/domain";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace CustomerActions {

  export class InitDefaultsFromCache extends BaseActions.InitDefaultsFromCache {
    public static override readonly type = '[Customer API] Init Defaults From Cache';
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

  export class SaveItem extends BaseActions.SaveItem<ICustomer> {
    public static override readonly type = '[Customer API] Save Item';
  }

  // Updates of state

  export class UpdateFilters extends BaseActions.UpdateFilters {
    public static override readonly type = '[Customer State] Update Filters';
  }

  export class UpdateTableState extends BaseActions.UpdateTableState<ICustomer> {
    public static override readonly type = '[Customer State] Update Table State';
  }

}
