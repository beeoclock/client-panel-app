export namespace AppActions {

	export class PageLoading {
		public static readonly type = '[App State] Page Loading';

		constructor(
			public readonly payload: boolean,
		) {
		}
	}

	export class ClearStates {
		public static readonly type = '[App State] Page Loading';

		constructor(
			public readonly payload: boolean,
		) {
		}
	}

	export class SetLastOpenedTenantIdMapByLogin {
		public static readonly type = '[App State] Set Last Opened Tenant Id Map By Login';

		constructor(
			public readonly accountEmail: string,
			public readonly tenantId: string,
		) {
		}
	}

}
