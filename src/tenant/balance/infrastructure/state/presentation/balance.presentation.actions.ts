import {BaseActions} from "@shared/state/base/base.actions";
import {IBalance} from "@tenant/balance/domain";

export namespace BalancePresentationActions {

	export class CloseDetails extends BaseActions.CloseDetails {
		public static override readonly type = '[Balance Application] Close Details';
	}

	export class CloseForm extends BaseActions.CloseForm {
		public static override readonly type = '[Balance Application] Close Form';
	}

	export class UpdateOpenedDetails extends BaseActions.UpdateOpenedDetails<IBalance.EntityRaw> {
		public static override readonly type = '[Balance Application] Update Opened Details';
	}

	export class OpenDetails extends BaseActions.OpenDetails<IBalance.EntityRaw> {
		public static override readonly type = '[Balance Application] Open Details';
	}

	export class OpenForm extends BaseActions.OpenForm<{
		isEditMode?: boolean;
		item?: IBalance.DTO;
	}> {
		public static override readonly type = '[Balance Application] Open Form';
	}
}
