import {BaseActions} from "@utility/state/base/base.actions";
import {IEvent_V2} from "@event/domain";
import {OrderServiceStatusEnum} from "@core/business-logic/order/enum/order-service.status.enum";

export namespace EventActions {

	// Application layer

	export class CloseDetails extends BaseActions.CloseDetails {
		public static override readonly type = '[Event Application] Close Details';
	}

	export class UpdateOpenedDetails extends BaseActions.UpdateOpenedDetails<IEvent_V2> {
		public static override readonly type = '[Event Application] Update Opened Details';
	}

	export class OpenDetails extends BaseActions.OpenDetails<IEvent_V2> {
		public static override readonly type = '[Event Application] Open Details';
	}

	// export class OpenDetailsById extends BaseActions.OpenDetailsById {
	// 	public static override readonly type = '[Event Application] Open Details By Id';
	// }

	export class ChangeServiceStatus {
		public static readonly type = '[Order API] Change Service Status';

		public constructor(
			public readonly payload: {
				orderId: string;
				serviceId: string;
				status: OrderServiceStatusEnum;
			}
		) {
		}
	}


}
