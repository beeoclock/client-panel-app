import ETenantPlugin from "@tenant/plugin/tenant-plugin/domain/entity/e.tenant-plugin";

export namespace TenantPluginDataActions {


	// export class UpdateItem extends BaseActions.UpdateItem<ITenantPlugin.EntityRaw> {
	// 	public static override readonly type = '[TenantPlugin API] Update Item';
	// }
	//
	// export class SetState {
	// 	public static readonly type = '[TenantPlugin API] SetState';
	//
	// 	constructor(
	// 		public readonly item: ITenantPlugin.DTO,
	// 		public readonly state: StateEnum,
	// 	) {
	// 	}
	// }

	export class Attach {
		public static readonly type = '[TenantPlugin API] Attach';

		constructor(
			public readonly payload: ETenantPlugin,
		) {
		}
	}

	export class Detach {
		public static readonly type = '[TenantPlugin API] Detach';

		constructor(
			public readonly payload: ETenantPlugin,
		) {
		}
	}


}
