import {BaseActions} from "@shared/state/base/base.actions";
import {IMember} from "@tenant/member/member/domain/interface/i.member";
import EMember from "@tenant/member/member/domain/entity/e.member";
import {StateEnum} from "@core/shared/enum/state.enum";
import {MemberProfileStatusEnum} from "@tenant/member/member/domain/enums/member-profile-status.enum";

export namespace MemberDataActions {

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
