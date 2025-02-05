import {BaseActions} from "@utility/state/base/base.actions";
import {IOrderDto} from "@order/domain/interface/details/i.order.dto";
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
			public readonly payload: ITableState<IOrderDto>['filters'],
		) {
		}
	}

	export class UpdateTableState {
		public static readonly type: string = '[PeerCustomerOrder] Update Table State';

		constructor(
			public readonly payload: ITableState<IOrderDto>
		) {
		}
	}

	export class PatchTableState {
		public static readonly type: string = '[PeerCustomerOrder] Patch Table State';

		constructor(
			public readonly payload: PITableState<IOrderDto>
		) {
		}
	}


}
