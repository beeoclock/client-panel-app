import {BaseActions} from "@shared/state/base/base.actions";
import {ITableState, PITableState} from "@shared/domain/table.state";
import EOrder from "@tenant/order/domain/entity/e.order";

export namespace PeerCustomerOrderActions {
	// API

	export class GetList extends BaseActions.GetList {
		public static override readonly type = '[PeerCustomerOrder API] Get List';
	}

	// Updates of state

	export class UpdateFilters {
		public static readonly type: string = '[PeerCustomerOrder] Update Filters';

		constructor(
			public readonly payload: ITableState<EOrder>['filters'],
		) {
		}
	}

	export class UpdateTableState {
		public static readonly type: string = '[PeerCustomerOrder] Update Table State';

		constructor(
			public readonly payload: ITableState<EOrder>
		) {
		}
	}

	export class PatchTableState {
		public static readonly type: string = '[PeerCustomerOrder] Patch Table State';

		constructor(
			public readonly payload: PITableState<EOrder>
		) {
		}
	}


}
