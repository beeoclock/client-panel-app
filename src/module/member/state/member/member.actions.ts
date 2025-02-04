import {BaseActions} from "@utility/state/base/base.actions";
import {RIMember} from "@member/domain";

export namespace MemberActions {

	// Application layer

	export class CloseDetails extends BaseActions.CloseDetails {
		public static override readonly type = '[Member Application] Close Details';
	}

	export class CloseForm extends BaseActions.CloseForm {
		public static override readonly type = '[Member Application] Close Form';
	}

	export class UpdateOpenedDetails extends BaseActions.UpdateOpenedDetails<RIMember> {
		public static override readonly type = '[Member Application] Update Opened Details';
	}

	export class OpenDetails extends BaseActions.OpenDetails<RIMember> {
		public static override readonly type = '[Member Application] Open Details';
	}

	export class OpenDetailsById extends BaseActions.OpenDetailsById {
		public static override readonly type = '[Member Application] Open Details By Id';
	}

	export class OpenFormToEditById extends BaseActions.OpenFormToEditById {
		public static override readonly type = '[Member Application] Open Form To Edit By Id';
	}

	export class OpenForm extends BaseActions.OpenForm<{
		item?: RIMember;
		isEditMode?: boolean;
	}> {
		public static override readonly type = '[Member Application] Open Form';
	}

	// API

	export class Init extends BaseActions.Init {
		public static override readonly type = '[Member State] Init';
	}

	export class GetList extends BaseActions.GetList {
		public static override readonly type = '[Member API] Get List';
	}

	export class DeleteItem extends BaseActions.DeleteItem {
		public static override readonly type = '[Member API] Delete Item';
	}

	export class ArchiveItem extends BaseActions.ArchiveItem {
		public static override readonly type = '[Member API] Archive Item';
	}

	export class GetItem extends BaseActions.GetItem {
		public static override readonly type = '[Member API] Get Item';
	}

	export class CreateItem extends BaseActions.CreateItem<RIMember> {
		public static override readonly type = '[Member API] Create Item';
	}

	export class UpdateItem extends BaseActions.UpdateItem<RIMember> {
		public static override readonly type = '[Member API] Update Item';
	}

	// Updates of state

	export class UpdateFilters extends BaseActions.UpdateFilters {
		public static override readonly type = '[Member State] Update Filters';
	}

	export class UpdateTableState extends BaseActions.UpdateTableState<RIMember> {
		public static override readonly type = '[Member State] Update Table State';
	}

}
