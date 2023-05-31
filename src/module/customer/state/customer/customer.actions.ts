import {BaseActions} from "@utility/state/base/base.actions";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace CustomerActions {

  export class GetList extends BaseActions.GetList {
    public static override readonly type = '[Customer API] Get List';
  }

  export class DeleteItem extends BaseActions.DeleteItem {
    public static override readonly type = '[Customer API] Delete Item';
  }

  export class GetItem extends BaseActions.GetItem {
    public static override readonly type = '[Customer API] Get Item';
  }

  // Updates of state

  export class UpdateFilters extends BaseActions.UpdateFilters {
    public static override readonly type = '[Customer State] Update Filters';
  }

  export class UpdateQueryParamsAtNavigator extends BaseActions.UpdateQueryParamsAtNavigator {
    public static override readonly type = '[Customer State] Update QueryParams At Navigator';
  }

  export class UpdatePaginationFromQueryParams extends BaseActions.UpdatePaginationFromQueryParams {
    public static override readonly type = '[Customer State] Update Pagination from QueryParams';
  }

}
