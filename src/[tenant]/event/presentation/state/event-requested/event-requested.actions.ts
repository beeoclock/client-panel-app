import {BaseActions} from "@utility/state/base/base.actions";
import {IEvent, RMIEvent} from "@[tenant]/event/domain";

export namespace EventRequestedActions {

	export class Init extends BaseActions.Init {
		public static override readonly type = '[Event Requested State] Init';
	}

	export class GetList extends BaseActions.GetList {
		public static override readonly type = '[Event Requested API] Get List';
	}

	// Updates of state

	export class UpdateFilters extends BaseActions.UpdateFilters {
		public static override readonly type = '[Event Requested State] Update Filters';
	}

	export class UpdateTableState extends BaseActions.UpdateTableState<RMIEvent> {
		public static override readonly type = '[Event Requested State] Update Table State';
	}

	// Statuses

	export class SetAutomaticallyDuration {
		public static readonly type = '[Event Requested API] Set Automatically Duration';

		constructor(
			public readonly payload: IEvent,
		) {
		}
	}

	export class RejectedStatus {
		public static readonly type = '[Event Requested API] Rejected Status';

		constructor(
			public readonly payload: IEvent,
		) {
		}
	}

	export class BookedStatus {
		public static readonly type = '[Event Requested API] Booked Success';

		constructor(
			public readonly payload: IEvent,
		) {
		}
	}

}
