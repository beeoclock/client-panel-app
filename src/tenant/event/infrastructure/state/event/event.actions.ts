import {BaseActions} from "@shared/state/base/base.actions";
import {IEvent_V2} from "@tenant/event/domain";

export namespace EventActions {

	export class CloseDetails extends BaseActions.CloseDetails {
		public static override readonly type = '[Event Application] Close Details';
	}

	export class OpenDetails extends BaseActions.OpenDetails<IEvent_V2> {
		public static override readonly type = '[Event Application] Open Details';
	}


}
