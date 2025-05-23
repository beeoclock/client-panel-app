import {BaseActions} from "@shared/state/base/base.actions";
import {IRole} from "@tenant/member/roles/domain";

export namespace RolePresentationActions {

	export class CloseDetails extends BaseActions.CloseDetails {
		public static override readonly type = '[Role Application] Close Details';
	}

	export class CloseForm extends BaseActions.CloseForm {
		public static override readonly type = '[Role Application] Close Form';
	}

	export class UpdateOpenedDetails extends BaseActions.UpdateOpenedDetails<IRole.DTO> {
		public static override readonly type = '[Role Application] Update Opened Details';
	}

	export class OpenDetails extends BaseActions.OpenDetails<IRole.DTO> {
		public static override readonly type = '[Role Application] Open Details';
	}

	export class OpenFormToEditById extends BaseActions.OpenFormToEditById {
		public static override readonly type = '[Role Application] Open Form To Edit By Id';
	}

	export class OpenForm extends BaseActions.OpenForm<{
		item?: IRole.DTO;
		isEditMode?: boolean;
	}> {
		public static override readonly type = '[Role Application] Open Form';
	}

}
