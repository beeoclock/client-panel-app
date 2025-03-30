import {BaseActions} from "@utility/state/base/base.actions";
import {ICustomer} from "@core/business-logic/customer";

export namespace CustomerPresentationActions {

	export class CloseDetails extends BaseActions.CloseDetails {
		public static override readonly type = '[Customer Application] Close Details';
	}

	export class CloseForm extends BaseActions.CloseForm {
		public static override readonly type = '[Customer Application] Close Form';
	}

	export class UpdateOpenedDetails extends BaseActions.UpdateOpenedDetails<ICustomer.EntityRaw> {
		public static override readonly type = '[Customer Application] Update Opened Details';
	}

	export class OpenDetails extends BaseActions.OpenDetails<ICustomer.EntityRaw> {
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
}
