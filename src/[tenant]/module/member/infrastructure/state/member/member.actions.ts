import {BaseActions} from "@utility/state/base/base.actions";
import {IMember} from "@core/business-logic/member/interface/i.member";
import EMember from "@core/business-logic/member/entity/e.member";
import {StateEnum} from "@core/shared/enum/state.enum";
import {MemberProfileStatusEnum} from "@core/business-logic/member/enums/member-profile-status.enum";

export namespace MemberActions {

	// Application layer

	export class CloseDetails extends BaseActions.CloseDetails {
		public static override readonly type = '[Member Application] Close Details';
	}

	export class CloseForm extends BaseActions.CloseForm {
		public static override readonly type = '[Member Application] Close Form';
	}

	export class UpdateOpenedDetails extends BaseActions.UpdateOpenedDetails<IMember.DTO> {
		public static override readonly type = '[Member Application] Update Opened Details';
	}

	export class OpenDetails extends BaseActions.OpenDetails<IMember.DTO> {
		public static override readonly type = '[Member Application] Open Details';
	}

	export class OpenDetailsById extends BaseActions.OpenDetailsById {
		public static override readonly type = '[Member Application] Open Details By Id';
	}

	export class OpenFormToEditById extends BaseActions.OpenFormToEditById {
		public static override readonly type = '[Member Application] Open Form To Edit By Id';
	}

	export class OpenForm extends BaseActions.OpenForm<{
		item?: IMember.DTO;
		isEditMode?: boolean;
	}> {
		public static override readonly type = '[Member Application] Open Form';
	}

	// API

	export class Init extends BaseActions.Init {
		public static override readonly type = '[Member State] Init';
	}

	export class GetList extends BaseActions.GetList {
		public static override readonly type = '[Member API] Get List';
	}

	export class GetItem extends BaseActions.GetItem {
		public static override readonly type = '[Member API] Get Item';
	}

	export class CreateItem extends BaseActions.CreateItem<IMember.EntityRaw> {
		public static override readonly type = '[Member API] Create Item';
	}

	export class UpdateItem extends BaseActions.UpdateItem<IMember.EntityRaw> {
		public static override readonly type = '[Member API] Update Item';
	}

	// Updates of state

	export class UpdateFilters extends BaseActions.UpdateFilters {
		public static override readonly type = '[Member State] Update Filters';
	}

	export class UpdateTableState extends BaseActions.UpdateTableState<EMember> {
		public static override readonly type = '[Member State] Update Table State';
	}

	export class SetState {
		public static readonly type = '[Member API] SetState';

		constructor(
			public readonly item: EMember,
			public readonly state: StateEnum,
		) {
		}
	}

	export class SetStatus {
		public static readonly type = '[Member API] SetStatus';

		constructor(
			public readonly item: EMember,
			public readonly status: MemberProfileStatusEnum,
		) {
		}
	}

}
