import EProduct from "@tenant/product/domain/entity/e.product";
import {BaseActions} from "@shared/state/base/base.actions";

export namespace ProductPresentationActions {

	export class OpenDetails extends BaseActions.OpenDetails<EProduct> {
		public static override readonly type = '[Product Application] Open Details';
	}

	export class CloseDetails extends BaseActions.CloseDetails {
		public static override readonly type = '[Product Application] Close Details';
	}

	export class CloseForm extends BaseActions.CloseForm {
		public static override readonly type = '[Product Application] Close Form';
	}

	export class UpdateOpenedDetails extends BaseActions.UpdateOpenedDetails<EProduct> {
		public static override readonly type = '[Product Application] Update Opened Details';
	}

	export class OpenForm extends BaseActions.OpenForm<{
		isEditMode?: boolean;
		item?: EProduct;
	}> {
		public static override readonly type = '[Product Application] Open Form';
	}

}
