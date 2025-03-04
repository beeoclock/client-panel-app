import {BaseActions} from "@utility/state/base/base.actions";
import {ICustomer} from "@src/core/business-logic/customer";
import {StateEnum} from "@core/shared/enum/state.enum";
import ECustomer from "@core/business-logic/customer/entity/e.customer";

export namespace CustomerActions {

	// Application layer

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

	// API

	export class Init extends BaseActions.Init {
		public static override readonly type = '[Customer State] Init';
	}

	export class GetList extends BaseActions.GetList {
		public static override readonly type = '[Customer API] Get List';
	}

	export class GetItem extends BaseActions.GetItem {
		public static override readonly type = '[Customer API] Get Item';
	}

	export class CreateItem extends BaseActions.CreateItem<ICustomer.EntityRaw> {
		public static override readonly type = '[Customer API] Create Item';
	}

	export class UpdateItem extends BaseActions.UpdateItem<ICustomer.EntityRaw> {
		public static override readonly type = '[Customer API] Update Item';
	}

	export class SetState {
		public static readonly type = '[Customer API] SetState';

		constructor(
			public readonly item: ICustomer.DTO,
			public readonly state: StateEnum,
		) {
		}
	}


	// Updates of state

	export class UpdateFilters extends BaseActions.UpdateFilters {
		public static override readonly type = '[Customer State] Update Filters';
	}

	export class UpdateTableState extends BaseActions.UpdateTableState<ECustomer> {
		public static override readonly type = '[Customer State] Update Table State';
	}

}
