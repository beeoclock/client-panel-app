import {BaseActions} from "@utility/state/base/base.actions";
import {ICustomer} from "@customer/domain";

export namespace CustomerActions {

	// Application layer

	export class CloseDetails extends BaseActions.CloseDetails {
		public static override readonly type = '[Customer Application] Close Details';
	}

	export class CloseForm extends BaseActions.CloseForm {
		public static override readonly type = '[Customer Application] Close Form';
	}

	export class UpdateOpenedDetails extends BaseActions.UpdateOpenedDetails<ICustomer.Entity> {
		public static override readonly type = '[Customer Application] Update Opened Details';
	}

	export class OpenDetails extends BaseActions.OpenDetails<ICustomer.Entity> {
		public static override readonly type = '[Customer Application] Open Details';
	}

	export class OpenDetailsById extends BaseActions.OpenDetailsById {
		public static override readonly type = '[Customer Application] Open Details By Id';
	}

	export class OpenFormToEditById extends BaseActions.OpenFormToEditById {
		public static override readonly type = '[Customer Application] Open Form To Edit By Id';
	}

	export class OpenForm extends BaseActions.OpenForm<{
		isEditMode?: boolean;
		item?: ICustomer.DTO;
	}> {
		public static override readonly type = '[Customer Application] Open Form';
	}

	// API

	export class Init extends BaseActions.Init {
		public static override readonly type = '[Customer State] Init';
	}

	export class GetList extends BaseActions.GetList {
		public static override readonly type = '[Customer API] Get List';
	}

	export class DeleteItem extends BaseActions.DeleteItem {
		public static override readonly type = '[Customer API] Delete Item';
	}

	export class GetItem extends BaseActions.GetItem {
		public static override readonly type = '[Customer API] Get Item';
	}

	export class CreateItem extends BaseActions.CreateItem<ICustomer.Entity> {
		public static override readonly type = '[Customer API] Create Item';
	}

	export class UpdateItem extends BaseActions.UpdateItem<ICustomer.Entity> {
		public static override readonly type = '[Customer API] Update Item';
	}

	export class ArchiveItem extends BaseActions.ArchiveItem {
		public static override readonly type = '[Customer API] Archive Item';
	}

	export class UnarchiveItem extends BaseActions.UnarchiveItem {
		public static override readonly type = '[Customer API] Unarchive Item';
	}

	// Updates of state

	export class UpdateFilters extends BaseActions.UpdateFilters {
		public static override readonly type = '[Customer State] Update Filters';
	}

	export class UpdateTableState extends BaseActions.UpdateTableState<ICustomer.Entity> {
		public static override readonly type = '[Customer State] Update Table State';
	}

}
