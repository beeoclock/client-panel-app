import {BaseActions} from "@utility/state/base/base.actions";
import {IOrderDto} from "@order/external/interface/details/i.order.dto";
import {IUpdateOrderDto} from "@order/external/interface/update/i.update-order.dto";
import {ICreateOrderDto} from "@order/external/interface/create/i.create-order.dto";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace OrderActions {

	// Application layer

	export class CloseDetails extends BaseActions.CloseDetails {
		public static override readonly type = '[Order Application] Close Details';
	}

	export class CloseForm extends BaseActions.CloseForm {
		public static override readonly type = '[Order Application] Close Form';
	}

	export class UpdateOpenedDetails extends BaseActions.UpdateOpenedDetails<IOrderDto> {
		public static override readonly type = '[Order Application] Update Opened Details';
	}

	export class OpenDetails extends BaseActions.OpenDetails<IOrderDto> {
		public static override readonly type = '[Order Application] Open Details';
	}

	export class OpenDetailsById extends BaseActions.OpenDetailsById {
		public static override readonly type = '[Order Application] Open Details By Id';
	}

	export class OpenFormToEditById extends BaseActions.OpenFormToEditById {
		public static override readonly type = '[Order Application] Open Form To Edit By Id';
	}

	export class OpenForm extends BaseActions.OpenForm<{
		isEditMode?: boolean;
		item?: IOrderDto;
	}> {
		public static override readonly type = '[Order Application] Open Form';
	}

	// API

	export class GetList extends BaseActions.GetList {
		public static override readonly type = '[Order API] Get List';
	}

	export class DeleteItem extends BaseActions.DeleteItem {
		public static override readonly type = '[Order API] Delete Item';
	}

	export class GetItem extends BaseActions.GetItem {
		public static override readonly type = '[Order API] Get Item';
	}

	export class CreateItem extends BaseActions.CreateItem<ICreateOrderDto> {
		public static override readonly type = '[Order API] Create Item';
	}

	export class UpdateItem extends BaseActions.UpdateItem<IUpdateOrderDto> {
		public static override readonly type = '[Order API] Update Item';
	}

	// Updates of state

	export class UpdateFilters extends BaseActions.UpdateFilters {
		public static override readonly type = '[Order State] Update Filters';
	}

	export class UpdateTableState extends BaseActions.UpdateTableState<IOrderDto> {
		public static override readonly type = '[Order State] Update Table State';
	}

}
