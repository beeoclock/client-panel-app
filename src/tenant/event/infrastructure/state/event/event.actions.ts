import {BaseActions} from "@shared/state/base/base.actions";

export namespace EventActions {

	export class CloseDetails extends BaseActions.CloseDetails {
		public static override readonly type = '[Event Application] Close Details';
	}

	export class OpenDetails extends BaseActions.OpenDetails<string> {
		public static override readonly type = '[Event Application] Open Details';
	}


}
