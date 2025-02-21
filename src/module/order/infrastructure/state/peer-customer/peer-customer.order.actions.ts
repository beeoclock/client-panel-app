import {BaseActions} from "@utility/state/base/base.actions";
import {IOrder} from "@src/core/business-logic/order/interface/i.order";
import {ITableState, PITableState} from "@utility/domain/table.state";

export namespace PeerCustomerOrderActions {
	// API

	export class GetList extends BaseActions.GetList {
		public static override readonly type = '[PeerCustomerOrder API] Get List';
	}

	// Updates of state

	export class UpdateFilters {
		public static readonly type: string = '[PeerCustomerOrder] Update Filters';

		constructor(
			public readonly payload: ITableState<IOrder.Entity>['filters'],
		) {
		}
	}

	export class UpdateTableState {
		public static readonly type: string = '[PeerCustomerOrder] Update Table State';

		constructor(
			public readonly payload: ITableState<IOrder.Entity>
		) {
		}
	}

	export class PatchTableState {
		public static readonly type: string = '[PeerCustomerOrder] Patch Table State';

		constructor(
			public readonly payload: PITableState<IOrder.Entity>
		) {
		}
	}


}
