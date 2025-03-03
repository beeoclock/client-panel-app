import {BaseActions} from "@utility/state/base/base.actions";

export namespace TariffPlanActions {

	// API

	export class Init extends BaseActions.Init {
		public static override readonly type = '[Tariff Plan State] Init';
	}

	export class GetList extends BaseActions.GetList {
		public static override readonly type = '[Tariff Plan API] Get List';
	}

	export class GetItem extends BaseActions.GetItem {
		public static override readonly type = '[Tariff Plan API] Get Item';
	}

}
