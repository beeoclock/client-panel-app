import {BaseActions} from "@utility/state/base/base.actions";
import {IAbsence} from "@src/core/business-logic/absence/interface/i.absence";
import {StateEnum} from "@core/shared/enum/state.enum";
import EAbsence from "@core/business-logic/absence/entity/e.absence";

export namespace AbsenceActions {

	// Application layer

	export class CloseDetails extends BaseActions.CloseDetails {
		public static override readonly type = '[Absence Application] Close Details';
	}

	export class CloseForm extends BaseActions.CloseForm {
		public static override readonly type = '[Absence Application] Close Form';
	}

	export class UpdateOpenedDetails extends BaseActions.UpdateOpenedDetails<EAbsence> {
		public static override readonly type = '[Absence Application] Update Opened Details';
	}

	export class OpenDetails extends BaseActions.OpenDetails<EAbsence> {
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
		item?: EAbsence;
		defaultValue?: Partial<IAbsence.DTO>;
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

	export class GetItem extends BaseActions.GetItem {
		public static override readonly type = '[Absence API] Get Item';
	}

	export class CreateItem extends BaseActions.CreateItem<EAbsence> {
		public static override readonly type = '[Absence API] Create Item';
	}

	export class UpdateItem extends BaseActions.UpdateItem<EAbsence> {
		public static override readonly type = '[Absence API] Update Item';
	}

	export class SetState {
		public static readonly type = '[Absence API] SetState';

		constructor(
			public readonly item: EAbsence,
			public readonly state: StateEnum,
		) {
		}
	}

	// Updates of state

	export class UpdateFilters extends BaseActions.UpdateFilters {
		public static override readonly type = '[Absence State] Update Filters';
	}

	export class UpdateTableState extends BaseActions.UpdateTableState<EAbsence> {
		public static override readonly type = '[Absence State] Update Table State';
	}

}
