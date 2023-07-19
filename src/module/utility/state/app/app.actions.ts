// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace AppActions {

  export class PageLoading {
    public static readonly type = '[App State] Page Loading';

    constructor(
      public payload: boolean,
    ) {
    }
  }

  export class ClearStates {
    public static readonly type = '[App State] Page Loading';

    constructor(
      public payload: boolean,
    ) {
    }
  }

}
