import {BaseActions} from "@shared/state/base/base.actions";
import EProductTag from "@tenant/product-tag/domain/entity/e.product-tag";

export namespace ProductTagPresentationActions {

	export class OpenDetails extends BaseActions.OpenDetails<EProductTag> {
		public static override readonly type = '[Product Tag Application] Open Details';
	}

	export class CloseDetails extends BaseActions.CloseDetails {
		public static override readonly type = '[Product Tag Application] Close Details';
	}

	export class CloseForm extends BaseActions.CloseForm {
		public static override readonly type = '[Product Tag Application] Close Form';
	}

	export class UpdateOpenedDetails extends BaseActions.UpdateOpenedDetails<EProductTag> {
		public static override readonly type = '[Product Tag Application] Update Opened Details';
	}

	export class OpenForm extends BaseActions.OpenForm<{
		isEditMode?: boolean;
		item?: EProductTag;
	}> {
		public static override readonly type = '[Product Tag Application] Open Form';
	}

}
