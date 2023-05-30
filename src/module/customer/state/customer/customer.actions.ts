import {IPagination_QueryParams} from "@utility/domain/pagination";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace CustomerActions {

  export class GetList {
    public static readonly type = '[Customer API] Get List';
  }

  export class DeleteItem {
    public static readonly type = '[Customer API] Delete Item';

    constructor(
      public payload: {
        id: string;
        refreshList?: boolean;
        goToTheList?: boolean;
      },
    ) {
    }
  }

  export class GetItem {
    public static readonly type = '[Customer API] Get Item';

    constructor(
      public payload: string,
    ) {
    }
  }

  // Updates of state

  export class UpdateFilters {
    public static readonly type = '[Customer State] Update Filters';

    constructor(
      public payload: {
        search: string | undefined;
      },
    ) {
    }
  }

  export class UpdateQueryParamsAtNavigator {
    public static readonly type = '[Customer State] Update QueryParams At Navigator';
  }

  export class UpdatePaginationFromQueryParams {
    public static readonly type = '[Customer State] Update Pagination from QueryParams';

    constructor(
      public payload: IPagination_QueryParams
    ) {
    }
  }

}
