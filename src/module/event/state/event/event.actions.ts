import {BaseActions} from "@utility/state/base/base.actions";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace EventActions {

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

  export class UpdateQueryParamsAtNavigator extends BaseActions.UpdateQueryParamsAtNavigator {
    public static override readonly type = '[Event State] Update QueryParams At Navigator';
  }

  export class UpdatePaginationFromQueryParams extends BaseActions.UpdatePaginationFromQueryParams {
    public static override readonly type = '[Event State] Update Pagination from QueryParams';
  }

}
