import {BaseActions} from "@shared/state/base/base.actions";
import {ICustomer} from "@tenant/customer/domain";

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

	export class OpenForm extends BaseActions.OpenForm<{
		isEditMode?: boolean;
		item?: ICustomer.DTO;
	}> {
		public static override readonly type = '[Customer Application] Open Form';
	}
}
