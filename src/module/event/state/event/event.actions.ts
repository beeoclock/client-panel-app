import {BaseActions} from "@utility/state/base/base.actions";
import {IEvent, RMIEvent} from "@event/domain";
import * as Member from '@member/domain';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace EventActions {

	// Application layer

	export class CloseForm extends BaseActions.CloseForm {
		public static override readonly type = '[Event Application] Close Form';
	}

	export class OpenDetails extends BaseActions.OpenDetails<IEvent> {
		public static override readonly type = '[Event Application] Open Details';
	}

	export class OpenDetailsById extends BaseActions.OpenDetailsById {
		public static override readonly type = '[Event Application] Open Details By Id';
	}

	export class OpenFormToEditById extends BaseActions.OpenFormToEditById {
		public static override readonly type = '[Event Application] Open Form To Edit By Id';
	}

	export class OpenForm extends BaseActions.OpenForm<{
		event?: IEvent;
		datetimeISO?: string;
		callback?: () => void;
		member?: Member.RIMember;
	}> {
		public static override readonly type = '[Event Application] Open Form';
	}

	// API

	export class Init extends BaseActions.Init {
		public static override readonly type = '[Event State] Init';
	}

	export class GetList extends BaseActions.GetList {
		public static override readonly type = '[Event API] Get List';
	}

	export class DeleteItem extends BaseActions.DeleteItem {
		public static override readonly type = '[Event API] Delete Item';
	}

	export class ArchiveItem extends BaseActions.ArchiveItem {
		public static override readonly type = '[Event API] Archive Item';
	}

	export class GetItem extends BaseActions.GetItem {
		public static override readonly type = '[Event API] Get Item';
	}

	export class CreateItem extends BaseActions.CreateItem<IEvent> {
		public static override readonly type = '[Event API] Create Item';
	}

	export class UpdateItem extends BaseActions.UpdateItem<IEvent> {
		public static override readonly type = '[Event API] Update Item';
	}

	// Updates of state

	export class UpdateFilters extends BaseActions.UpdateFilters {
		public static override readonly type = '[Event State] Update Filters';
	}

	export class UpdateTableState extends BaseActions.UpdateTableState<RMIEvent> {
		public static override readonly type = '[Event State] Update Table State';
	}

	// Statuses

	export class DoneStatus {
		public static readonly type = '[Event API] Done Status';

		constructor(
			public readonly payload: IEvent,
		) {
		}
	}

	export class CancelledStatus {
		public static readonly type = '[Event API] Cancelled Status';

		constructor(
			public readonly payload: IEvent,
		) {
		}
	}

}
