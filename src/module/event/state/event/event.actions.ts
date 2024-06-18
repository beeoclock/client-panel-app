import {BaseActions} from "@utility/state/base/base.actions";
import {IEvent_V2} from "@event/domain";
import {OrderServiceStatusEnum} from "@order/domain/enum/order-service.status.enum";
import {IOrderServiceDto} from "@order/external/interface/i.order-service.dto";
import {IOrderDto} from "@order/external/interface/details/i.order.dto";

// eslint-disable-next-line @typescript-eslint/no-namespace
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

	export class OpenDetailsById extends BaseActions.OpenDetailsById {
		public static override readonly type = '[Event Application] Open Details By Id';
	}

	export class OpenOrderServiceForm {
		public static readonly type = '[Event Application] Open Order Service Form';

		public constructor(
			public readonly payload: {
				event: IEvent_V2<{ order: IOrderDto; service: IOrderServiceDto; }>;
				isEditMode?: boolean;
			}
		) {
		}
	}

	export class ChangeServiceStatus {
		public static readonly type = '[Event API] Change Service Status';

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
