import {IdTokenResult} from "@angular/fire/auth";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace IdentityActions {

  export class InitToken {
    public static readonly type = '[Identity State] Init Token';
  }

  export class Token {
    public static readonly type = '[Identity State] Token';

    constructor(
      public readonly payload: IdTokenResult
    ) {
    }
  }

  export class ClearToken {
    public static readonly type = '[Identity State] Clear Token';
  }

  export class GetClients {
    public static readonly type = '[Identity API] Get Client';
  }

	export class RefreshTokenExecute {
		public static readonly type = '[Identity API] RefreshTokenExecute';
	}

}
