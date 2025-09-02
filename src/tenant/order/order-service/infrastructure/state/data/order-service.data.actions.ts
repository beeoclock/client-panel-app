import {BaseActions} from "@shared/state/base/base.actions";
import {OrderStatusEnum} from "@tenant/order/order/domain/enum/order.status.enum";
import {IOrder} from "@tenant/order/order/domain/interface/i.order";
import {StateEnum} from "@core/shared/enum/state.enum";
import {OrderServiceStatusEnum} from "@tenant/order/order-service/domain/enum/order-service.status.enum";
import {IOrderService} from "@tenant/order/order-service/domain/interface/i.order-service.dto";
import {ISpecialist} from "@tenant/service/domain/interface/i.specialist";
import {IAttendeeDto} from "@tenant/order/order/domain/interface/i-order-appointment-details.dto";

export namespace OrderServiceDataActions {

	export class Init extends BaseActions.Init {
		public static override readonly type = '[Order Service State] Init';
	}

	export class UpdateItem extends BaseActions.UpdateItem<IOrderService.EntityRaw> {
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

	export class SetDuration {
		public static readonly type = '[Ordered Service] Set Duration';

		public constructor(
			public readonly payload: {
				orderedServiceId: string;
				durationInSeconds: number;
			},
		) {
		}
	}

	export class SetPrice {
		public static readonly type = '[Ordered Service] Set Price';

		public constructor(
			public readonly payload: {
				orderedServiceId: string;
				price: number;
			},
		) {
		}
	}

	export class SetSpecialists {
		public static readonly type = '[Ordered Service] Set Specialists';

		public constructor(
			public readonly payload: {
				orderedServiceId: string;
				specialists: ISpecialist[];
			},
		) {
		}
	}

	export class SetStart {
		public static readonly type = '[Ordered Service] Set Start';

		public constructor(
			public readonly payload: {
				orderedServiceId: string;
				start: string;
			},
		) {
		}
	}

	export class SetAttendees {
		public static readonly type = '[Ordered Service] Set Attendees';

		public constructor(
			public readonly payload: {
				orderedServiceId: string;
				attendees: IAttendeeDto[];
			},
		) {
		}
	}

}
