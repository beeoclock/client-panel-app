import {BaseActions} from "@utility/state/base/base.actions";
import {IEmployee} from "@employee/domain";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace EmployeeActions {

  export class InitDefaultsFromCache extends BaseActions.InitDefaultsFromCache {
    public static override readonly type = '[Employee API] Init Defaults From Cache';
  }

  export class GetList extends BaseActions.GetList {
    public static override readonly type = '[Employee API] Get List';
  }

  export class DeleteItem extends BaseActions.DeleteItem {
    public static override readonly type = '[Employee API] Delete Item';
  }

  export class GetItem extends BaseActions.GetItem {
    public static override readonly type = '[Employee API] Get Item';
  }

  // Updates of state

  export class UpdateFilters extends BaseActions.UpdateFilters {
    public static override readonly type = '[Employee State] Update Filters';
  }

  export class UpdateTableState extends BaseActions.UpdateTableState<IEmployee> {
    public static override readonly type = '[Employee State] Update Table State';
  }

}
