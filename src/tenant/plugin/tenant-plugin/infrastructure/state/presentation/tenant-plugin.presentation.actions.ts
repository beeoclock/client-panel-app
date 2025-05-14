import {BaseActions} from "@shared/state/base/base.actions";
import {ITenantPlugin} from "@tenant/plugin/tenant-plugin/domain";

export namespace TenantPluginPresentationActions {

	export class CloseDetails extends BaseActions.CloseDetails {
		public static override readonly type = '[TenantPlugin Application] Close Details';
	}

	export class CloseForm extends BaseActions.CloseForm {
		public static override readonly type = '[TenantPlugin Application] Close Form';
	}

	export class UpdateOpenedDetails extends BaseActions.UpdateOpenedDetails<ITenantPlugin.EntityRaw> {
		public static override readonly type = '[TenantPlugin Application] Update Opened Details';
	}

	export class OpenDetails extends BaseActions.OpenDetails<ITenantPlugin.EntityRaw> {
		public static override readonly type = '[TenantPlugin Application] Open Details';
	}

	export class OpenForm extends BaseActions.OpenForm<{
		isEditMode?: boolean;
		item?: ITenantPlugin.DTO;
	}> {
		public static override readonly type = '[TenantPlugin Application] Open Form';
	}
}
