// eslint-disable-next-line @typescript-eslint/no-namespace
import {IPagination_QueryParams} from "@utility/domain/pagination";

export namespace CustomerActions {

  export class UpdateQueryParamsAtNavigator {
    public static readonly type = '[Customer State] Update QueryParams At Navigator';
  }

  export class GetList {
    public static readonly type = '[Customer API] Get List';
  }

  export class DeleteItem {
    public static readonly type = '[Customer API] Delete Item';

    constructor(
      public payload: string,
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

  export class UpdatePaginationFromQueryParams {
    public static readonly type = '[Customer State] Update Pagination from QueryParams';

    constructor(
      public payload: IPagination_QueryParams
    ) {
    }
  }

}
