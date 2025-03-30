import {BaseActions} from "@utility/state/base/base.actions";
import {StateEnum} from "@core/shared/enum/state.enum";
import EAbsence from "@core/business-logic/absence/entity/e.absence";

export namespace AbsenceDataActions {

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

}
