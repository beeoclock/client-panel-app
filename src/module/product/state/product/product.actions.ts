import { BaseActions } from '@utility/state/base/base.actions';
import { IProduct } from "@product/domain";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ProductActions {

	export class OpenDetails extends BaseActions.OpenDetails<IProduct> {
		public static override readonly type = '[Product Application] Open Details';
	}

	export class CloseDetails extends BaseActions.CloseDetails {
		public static override readonly type = '[Product Application] Close Details';
	}

	export class CloseForm extends BaseActions.CloseForm {
		public static override readonly type = '[Product Application] Close Form';
	}

	export class OpenForm extends BaseActions.OpenForm<{
			isEditMode?: boolean;
			item?: IProduct;
		}> {
		public static override readonly type = '[Product Application] Open Form';
	}

	export class OpenFormToEditById extends BaseActions.OpenFormToEditById {
		public static override readonly type = '[Product Application] Open Form To Edit By Id';
	}

	// API

	export class Init extends BaseActions.Init {
		public static override readonly type = '[Product State] Init';
	}

	export class GetList extends BaseActions.GetList {
		public static override readonly type = '[Product API] Get List';
	}

	export class DeleteItem extends BaseActions.DeleteItem {
		public static override readonly type = '[Product API] Delete Item';
	}

	export class GetItem extends BaseActions.GetItem {
		public static override readonly type = '[Customer API] Get Item';
	}

	export class CreateItem extends BaseActions.CreateItem<IProduct> {
		public static override readonly type = '[Product API] Create Item';
	}

	export class UpdateItem extends BaseActions.UpdateItem<IProduct> {
		public static override readonly type = '[Product API] Update Item';
	}

	// Updates of state

	export class UpdateFilters extends BaseActions.UpdateFilters {
		public static override readonly type = '[Product State] Update Filters';
	}

	export class UpdateTableState extends BaseActions.UpdateTableState<IProduct> {
		public static override readonly type = '[Product State] Update Table State';
	}
}
