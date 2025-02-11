import {BaseActions} from "@utility/state/base/base.actions";
import {IService} from "@service/domain/interface/i.service";
import {StateEnum} from "@utility/domain/enum/state.enum";

export namespace ServiceActions {

	// Application layer


	export class CloseDetails extends BaseActions.CloseDetails {
		public static override readonly type = '[Service Application] Close Details';
	}


	export class CloseForm extends BaseActions.CloseForm {
		public static override readonly type = '[Service Application] Close Form';
	}

	export class UpdateOpenedDetails extends BaseActions.UpdateOpenedDetails<IService.DTO> {
		public static override readonly type = '[Service Application] Update Opened Details';
	}

	export class OpenDetails extends BaseActions.OpenDetails<IService.DTO> {
		public static override readonly type = '[Service Application] Open Details';
	}

	export class OpenDetailsById extends BaseActions.OpenDetailsById {
		public static override readonly type = '[Service Application] Open Details By Id';
	}

	export class OpenFormToEditById extends BaseActions.OpenFormToEditById {
		public static override readonly type = '[Service Application] Open Form To Edit By Id';
	}

	export class OpenForm extends BaseActions.OpenForm<{
		isEditMode?: boolean;
		item?: IService.DTO;
	}> {
		public static override readonly type = '[Service Application] Open Form';
	}

	// API

	export class Init extends BaseActions.Init {
		public static override readonly type = '[Service State] Init';
	}

	export class GetList extends BaseActions.GetList {
		public static override readonly type = '[Service API] Get List';
	}

	export class DeleteItem extends BaseActions.DeleteItem {
		public static override readonly type = '[Service API] Delete Item';
	}

	export class SetState {
		public static readonly type = '[Service API] SetState';

		constructor(
			public readonly id: string,
			public readonly state: StateEnum,
		) {
		}
	}

	export class GetItem extends BaseActions.GetItem {
		public static override readonly type = '[Service API] Get Item';
	}

	export class CreateItem extends BaseActions.CreateItem<IService.DTO> {
		public static override readonly type = '[Service API] Create Item';
	}

	export class UpdateItem extends BaseActions.UpdateItem<IService.DTO> {
		public static override readonly type = '[Service API] Update Item';
	}

	// Updates of state

	export class UpdateFilters extends BaseActions.UpdateFilters {
		public static override readonly type = '[Service State] Update Filters';
	}

	export class UpdateTableState extends BaseActions.UpdateTableState<IService.DTO> {
		public static override readonly type = '[Service State] Update Table State';
	}

}
