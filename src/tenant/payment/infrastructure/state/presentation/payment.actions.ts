import {BaseActions} from "@shared/state/base/base.actions";
import {IPayment} from "@tenant/payment/domain/interface/i.payment";

export namespace PaymentActions {

	// Application layer

	export class CloseDetails extends BaseActions.CloseDetails {
		public static override readonly type = '[Payment Application] Close Details';
	}

	export class CloseForm extends BaseActions.CloseForm {
		public static override readonly type = '[Payment Application] Close Form';
	}

	export class UpdateOpenedDetails extends BaseActions.UpdateOpenedDetails<IPayment.DTO> {
		public static override readonly type = '[Payment Application] Update Opened Details';
	}

	export class OpenDetails extends BaseActions.OpenDetails<IPayment.DTO> {
		public static override readonly type = '[Payment Application] Open Details';
	}

	export class OpenDetailsById extends BaseActions.OpenDetailsById {
		public static override readonly type = '[Payment Application] Open Details By Id';
	}

	export class OpenFormToEditById extends BaseActions.OpenFormToEditById {
		public static override readonly type = '[Payment Application] Open Form To Edit By Id';
	}

	export class OpenForm extends BaseActions.OpenForm<{
		isEditMode?: boolean;
		item?: IPayment.DTO;
	}> {
		public static override readonly type = '[Payment Application] Open Form';
	}

}
