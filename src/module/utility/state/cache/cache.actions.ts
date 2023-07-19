// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace CacheActions {

  export class Init {
    public static readonly type = '[Cache State] Init';
  }

  export class Set {
    public static readonly type = '[Cache State] Set';

    constructor(
      public payload: {
        strategy: 'indexedDB' | Storage;
        key: string;
        value: string;
      },
    ) {
    }
  }

  export class Get {
    public static readonly type = '[Cache State] Get';

    constructor(
      public payload: {
        strategy: 'indexedDB' | Storage;
        key: string;
      },
    ) {
    }
  }

  export class Remove {
    public static readonly type = '[Cache State] Remove';

    constructor(
      public payload: {
        strategy: 'indexedDB' | Storage;
        key: string;
      },
    ) {
    }
  }

}
