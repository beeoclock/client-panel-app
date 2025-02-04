import {BaseActions} from "@utility/state/base/base.actions";
import {IServiceDto} from "@order/external/interface/i.service.dto";

export namespace ServiceActions {

	// Application layer


	export class CloseDetails extends BaseActions.CloseDetails {
		public static override readonly type = '[Service Application] Close Details';
	}


	export class CloseForm extends BaseActions.CloseForm {
		public static override readonly type = '[Service Application] Close Form';
	}

	export class UpdateOpenedDetails extends BaseActions.UpdateOpenedDetails<IServiceDto> {
		public static override readonly type = '[Service Application] Update Opened Details';
	}

	export class OpenDetails extends BaseActions.OpenDetails<IServiceDto> {
		public static override readonly type = '[Service Application] Open Details';
	}

	export class OpenDetailsById extends BaseActions.OpenDetailsById {
		public static override readonly type = '[Service Application] Open Details By Id';
	}

	export class OpenFormToEditById extends BaseActions.OpenFormToEditById {
		public static override readonly type = '[Service Application] Open Form To Edit By Id';
	}

	export class OpenForm extends BaseActions.OpenForm<{
		isEditMode?: boolean;
		item?: IServiceDto;
	}> {
		public static override readonly type = '[Service Application] Open Form';
	}

	// API

	export class Init extends BaseActions.Init {
		public static override readonly type = '[Service State] Init';
	}

	export class GetList extends BaseActions.GetList {
		public static override readonly type = '[Service API] Get List';
	}

	export class DeleteItem extends BaseActions.DeleteItem {
		public static override readonly type = '[Service API] Delete Item';
	}

	export class ArchiveItem extends BaseActions.ArchiveItem {
		public static override readonly type = '[Service API] Archive Item';
	}

	export class UnarchiveItem extends BaseActions.UnarchiveItem {
		public static override readonly type = '[Service API] Unarchive Item';
	}

	export class GetItem extends BaseActions.GetItem {
		public static override readonly type = '[Service API] Get Item';
	}

	export class CreateItem extends BaseActions.CreateItem<IServiceDto> {
		public static override readonly type = '[Service API] Create Item';
	}

	export class UpdateItem extends BaseActions.UpdateItem<IServiceDto> {
		public static override readonly type = '[Service API] Update Item';
	}

	// Updates of state

	export class UpdateFilters extends BaseActions.UpdateFilters {
		public static override readonly type = '[Service State] Update Filters';
	}

	export class UpdateTableState extends BaseActions.UpdateTableState<IServiceDto> {
		public static override readonly type = '[Service State] Update Table State';
	}

}
