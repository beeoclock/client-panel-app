import {BaseActions} from "@utility/state/base/base.actions";
import {RIMember} from "@member/domain";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace MemberActions {

  export class Init extends BaseActions.Init {
    public static override readonly type = '[Member State] Init';
  }

  export class InitDefaultsFromCache extends BaseActions.InitDefaultsFromCache {
    public static override readonly type = '[Member API] Init Defaults From Cache';
  }

  export class ClearTableCache extends BaseActions.ClearTableCache {
    public static override readonly type = '[Member Cache] Clear Table Cache';
  }

  export class ClearItemCache extends BaseActions.ClearItemCache {
    public static override readonly type = '[Member Cache] Clear Item Cache';
  }

  export class ClearTableCacheAndGetList extends BaseActions.ClearTableCacheAndGetList {
    public static override readonly type = '[Member Cache & API] Clear Table Cache And Get List';
  }

  export class ClearItemCacheAndGetItem extends BaseActions.ClearItemCacheAndGetItem {
    public static override readonly type = '[Member Cache & API] Clear Item Cache And Get Item';
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

  export class CreateItem extends BaseActions.CreateItem<RIMember> {
    public static override readonly type = '[Member API] Create Item';
  }

  export class UpdateItem extends BaseActions.UpdateItem<RIMember> {
    public static override readonly type = '[Member API] Update Item';
  }

  // Updates of state

  export class UpdateFilters extends BaseActions.UpdateFilters {
    public static override readonly type = '[Member State] Update Filters';
  }

  export class UpdateTableState extends BaseActions.UpdateTableState<RIMember> {
    public static override readonly type = '[Member State] Update Table State';
  }

}
