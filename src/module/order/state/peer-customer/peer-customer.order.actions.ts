import {BaseActions} from "@utility/state/base/base.actions";
import {IOrderDto} from "@order/external/interface/details/i.order.dto";

export namespace PeerCustomerOrderActions {
	// API

	export class GetList extends BaseActions.GetList {
		public static override readonly type = '[Order API] Get List';
	}

	// Updates of state

	export class UpdateFilters extends BaseActions.UpdateFilters {
		public static override readonly type = '[Order State] Update Filters';
	}

	export class UpdateTableState extends BaseActions.UpdateTableState<IOrderDto> {
		public static override readonly type = '[Order State] Update Table State';
	}


}
