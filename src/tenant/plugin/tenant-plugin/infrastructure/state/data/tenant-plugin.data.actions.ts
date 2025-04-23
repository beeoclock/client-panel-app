import {BaseActions} from "@shared/state/base/base.actions";
import {StateEnum} from "@core/shared/enum/state.enum";
import {ITenantPlugin} from "@tenant/plugin/tenant-plugin/domain";

export namespace TenantPluginDataActions {

	export class CreateItem extends BaseActions.CreateItem<ITenantPlugin.EntityRaw> {
		public static override readonly type = '[TenantPlugin API] Create Item';
	}

	export class UpdateItem extends BaseActions.UpdateItem<ITenantPlugin.EntityRaw> {
		public static override readonly type = '[TenantPlugin API] Update Item';
	}

	export class SetState {
		public static readonly type = '[TenantPlugin API] SetState';

		constructor(
			public readonly item: ITenantPlugin.DTO,
			public readonly state: StateEnum,
		) {
		}
	}


}
