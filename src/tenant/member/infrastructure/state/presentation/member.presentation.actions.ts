import {BaseActions} from "@utility/state/base/base.actions";
import {IMember} from "@tenant/member/domain/interface/i.member";

export namespace MemberPresentationActions {

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

}
