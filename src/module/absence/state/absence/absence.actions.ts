import {BaseActions} from "@utility/state/base/base.actions";
import {IAbsence} from "@absence/domain/interface/i.absence";

export namespace AbsenceActions {

	// Application layer

	export class CloseDetails extends BaseActions.CloseDetails {
		public static override readonly type = '[Absence Application] Close Details';
	}

	export class CloseForm extends BaseActions.CloseForm {
		public static override readonly type = '[Absence Application] Close Form';
	}

	export class UpdateOpenedDetails extends BaseActions.UpdateOpenedDetails<IAbsence.DTO> {
		public static override readonly type = '[Absence Application] Update Opened Details';
	}

	export class OpenDetails extends BaseActions.OpenDetails<IAbsence.DTO> {
		public static override readonly type = '[Absence Application] Open Details';
	}

	export class OpenDetailsById extends BaseActions.OpenDetailsById {
		public static override readonly type = '[Absence Application] Open Details By Id';
	}

	export class OpenFormToEditById extends BaseActions.OpenFormToEditById {
		public static override readonly type = '[Absence Application] Open Form To Edit By Id';
	}

	export class OpenForm extends BaseActions.OpenForm<{
		isEditMode?: boolean;
		item?: Partial<IAbsence.DTO>;
	}> {
		public static override readonly type = '[Absence Application] Open Form';
	}

	// API

	export class Init extends BaseActions.Init {
		public static override readonly type = '[Service State] Init';
	}

	export class GetList extends BaseActions.GetList {
		public static override readonly type = '[Absence API] Get List';
	}

	export class DeleteItem extends BaseActions.DeleteItem {
		public static override readonly type = '[Absence API] Delete Item';
	}

	export class GetItem extends BaseActions.GetItem {
		public static override readonly type = '[Absence API] Get Item';
	}

	export class CreateItem extends BaseActions.CreateItem<IAbsence.DTO> {
		public static override readonly type = '[Absence API] Create Item';
	}

	export class UpdateItem extends BaseActions.UpdateItem<IAbsence.DTO> {
		public static override readonly type = '[Absence API] Update Item';
	}

	export class ArchiveItem extends BaseActions.ArchiveItem {
		public static override readonly type = '[Absence API] Archive Item';
	}

	export class UnarchiveItem extends BaseActions.UnarchiveItem {
		public static override readonly type = '[Absence API] Unarchive Item';
	}

	// Updates of state

	export class UpdateFilters extends BaseActions.UpdateFilters {
		public static override readonly type = '[Absence State] Update Filters';
	}

	export class UpdateTableState extends BaseActions.UpdateTableState<IAbsence.DTO> {
		public static override readonly type = '[Absence State] Update Table State';
	}

}
