import {BaseActions} from "@utility/state/base/base.actions";
import {IAbsence} from "@core/business-logic/absence/interface/i.absence";
import EAbsence from "@core/business-logic/absence/entity/e.absence";

export namespace AbsencePresentationActions {

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

}
