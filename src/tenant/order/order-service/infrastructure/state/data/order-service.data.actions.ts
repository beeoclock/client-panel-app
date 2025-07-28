import {BaseActions} from "@shared/state/base/base.actions";
import {OrderStatusEnum} from "@tenant/order/order/domain/enum/order.status.enum";
import {IOrder} from "@tenant/order/order/domain/interface/i.order";
import {StateEnum} from "@core/shared/enum/state.enum";
import {OrderServiceStatusEnum} from "@tenant/order/order-service/domain/enum/order-service.status.enum";

export namespace OrderServiceDataActions {

	export class Init extends BaseActions.Init {
		public static override readonly type = '[Order Service State] Init';
	}

	export class UpdateItem extends BaseActions.UpdateItem<IOrder.EntityRaw> {
		public static override readonly type = '[Order Service API] Update Item';
	}

	export class ChangeStatus {
		public static readonly type = '[Order State] Change Status';

		public constructor(
			public readonly payload: {
				id: string;
				status: OrderStatusEnum;
			}
		) {
		}
	}

	export class SetState {
		public static readonly type = '[Order Service API] SetState';

		constructor(
			public readonly item: IOrder.DTO,
			public readonly state: StateEnum,
		) {
		}
	}

	// OrderedService

	export class OrderedServiceStatus {
		public static readonly type = '[Ordered Service] Status';

		constructor(
			public readonly orderId: string,
			public readonly orderedServiceId: string,
			public readonly status: OrderServiceStatusEnum,
		) {
		}
	}

	export class OrderedServiceState {
		public static readonly type = '[Ordered Service] SetState';

		constructor(
			public readonly orderId: string,
			public readonly orderedServiceId: string,
			public readonly state: StateEnum,
		) {
		}
	}

}
