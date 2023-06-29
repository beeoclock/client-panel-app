import {ITableState} from "@utility/domain/table.state";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace BaseActions {

  export abstract class GetList {
    public static readonly type: string = '[TODO] Not Implemented Yet!';
  }

  export abstract class InitDefaultsFromCache {
    public static readonly type: string = '[TODO] Not Implemented Yet!';
  }

  export abstract class DeleteItem {
    public static readonly type: string = '[TODO] Not Implemented Yet!';

    constructor(
      public payload: {
        id: string;
        refreshList?: boolean;
        goToTheList?: boolean;
      },
    ) {
    }
  }

  export abstract class GetItem {
    public static readonly type: string = '[TODO] Not Implemented Yet!';

    constructor(
      public payload: string,
    ) {
    }
  }

  export abstract class SaveItem<ITEM> {
    public static readonly type: string = '[TODO] Not Implemented Yet!';

    constructor(
      public payload: ITEM,
    ) {
    }
  }

  // Updates of state

  export abstract class UpdateFilters {
    public static readonly type: string = '[TODO] Not Implemented Yet!';

    constructor(
      public payload: {
        search: string | undefined;
      },
    ) {
    }
  }

  export abstract class UpdateTableState<ITEM> {
    public static readonly type: string = '[TODO] Not Implemented Yet!';

    constructor(
      public payload: ITableState<ITEM>
    ) {
    }
  }

}
