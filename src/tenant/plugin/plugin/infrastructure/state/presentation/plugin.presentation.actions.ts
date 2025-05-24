import {BaseActions} from "@shared/state/base/base.actions";
import {IPlugin} from "@tenant/plugin/plugin/domain";

export namespace PluginPresentationActions {

	export class CloseDetails extends BaseActions.CloseDetails {
		public static override readonly type = '[Plugin Application] Close Details';
	}

	export class CloseForm extends BaseActions.CloseForm {
		public static override readonly type = '[Plugin Application] Close Form';
	}

	export class UpdateOpenedDetails extends BaseActions.UpdateOpenedDetails<IPlugin.EntityRaw> {
		public static override readonly type = '[Plugin Application] Update Opened Details';
	}

	export class OpenDetails extends BaseActions.OpenDetails<IPlugin.EntityRaw> {
		public static override readonly type = '[Plugin Application] Open Details';
	}

	export class OpenForm extends BaseActions.OpenForm<{
		isEditMode?: boolean;
		item?: IPlugin.DTO;
	}> {
		public static override readonly type = '[Plugin Application] Open Form';
	}
}
