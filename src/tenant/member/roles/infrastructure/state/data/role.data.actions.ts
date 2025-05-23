import {BaseActions} from "@shared/state/base/base.actions";
import {StateEnum} from "@core/shared/enum/state.enum";
import {MemberProfileStatusEnum} from "@tenant/member/member/domain/enums/member-profile-status.enum";
import {IRole} from "@tenant/member/roles/domain";
import ERole from "@tenant/member/roles/domain/entity/e.role";

export namespace RoleDataActions {

	export class Init extends BaseActions.Init {
		public static override readonly type = '[Role State] Init';
	}

	export class GetList extends BaseActions.GetList {
		public static override readonly type = '[Role API] Get List';
	}

	export class GetItem extends BaseActions.GetItem {
		public static override readonly type = '[Role API] Get Item';
	}

	export class CreateItem extends BaseActions.CreateItem<IRole.EntityRaw> {
		public static override readonly type = '[Role API] Create Item';
	}

	export class UpdateItem extends BaseActions.UpdateItem<IRole.EntityRaw> {
		public static override readonly type = '[Role API] Update Item';
	}

	// Updates of state

	export class UpdateFilters extends BaseActions.UpdateFilters {
		public static override readonly type = '[Role State] Update Filters';
	}

	export class UpdateTableState extends BaseActions.UpdateTableState<ERole> {
		public static override readonly type = '[Role State] Update Table State';
	}

	export class SetState {
		public static readonly type = '[Role API] SetState';

		constructor(
			public readonly item: ERole,
			public readonly state: StateEnum,
		) {
		}
	}

	export class SetStatus {
		public static readonly type = '[Role API] SetStatus';

		constructor(
			public readonly item: ERole,
			public readonly status: MemberProfileStatusEnum,
		) {
		}
	}

}
