import {BaseActions} from "@shared/state/base/base.actions";
import {ICustomer} from "@tenant/customer/domain";
import {OrderStatusEnum} from "@tenant/order/order/domain/enum/order.status.enum";
import {IService} from "@tenant/service/domain/interface/i.service";
import {IOrder} from "@tenant/order/order/domain/interface/i.order";
import {IMember} from "@tenant/member/member/domain/interface/i.member";
import {StateEnum} from "@core/shared/enum/state.enum";
import {OrderServiceStatusEnum} from "@tenant/order/order-service/domain/enum/order-service.status.enum";
import EOrderService from "@tenant/order/order-service/domain/entity/e.order-service";

export namespace OrderActions {

	// Application layer

	export class CloseDetails extends BaseActions.CloseDetails {
		public static override readonly type = '[Order Application] Close Details';
	}

	export class CloseForm extends BaseActions.CloseForm {
		public static override readonly type = '[Order Application] Close Form';
	}

	export class UpdateOpenedDetails extends BaseActions.UpdateOpenedDetails<IOrder.DTO> {
		public static override readonly type = '[Order Application] Update Opened Details';
	}

	export class OpenDetails extends BaseActions.OpenDetails<IOrder.DTO> {
		public static override readonly type = '[Order Application] Open Details';
	}

	export class OpenFormToEditById extends BaseActions.OpenFormToEditById {
		public static override readonly type = '[Order Application] Open Form To Edit By Id';
	}

	export class OpenForm extends BaseActions.OpenForm<{
		isEditMode?: boolean;
		item?: IOrder.DTO;
		setupPartialData?: {
			defaultAppointmentStartDateTimeIso?: string;
			defaultMemberForService?: IMember.EntityRaw;
			serviceList?: IService.DTO[];
			customer?: ICustomer.DTO;
		};
	}> {
		public static override readonly type = '[Order Application] Open Form';
	}

	// API

	export class Init extends BaseActions.Init {
		public static override readonly type = '[Order State] Init';
	}

	export class CreateItem extends BaseActions.CreateItem<IOrder.EntityRaw> {
		public static override readonly type = '[Order API] Create Item';
	}

	export class UpdateItem extends BaseActions.UpdateItem<IOrder.EntityRaw> {
		public static override readonly type = '[Order API] Update Item';
	}

	export class ChangeStatus {
		public static readonly type = '[Order State] Change Status';

		public constructor(
			public readonly payload: {
				item: IOrder.EntityRaw;
				status: OrderStatusEnum;
			}
		) {
		}
	}

	export class SetState {
		public static readonly type = '[Order API] SetState';

		public constructor(
			public readonly item: IOrder.EntityRaw,
			public readonly state: StateEnum,
		) {
		}
	}

	// OrderedService

	export class OrderedServiceStatus {
		public static readonly type = '[Ordered Service] Status';

		public constructor(
			public readonly orderId: string,
			public readonly orderedServiceId: string,
			public readonly status: OrderServiceStatusEnum,
		) {
		}
	}

	export class OrderedServiceState {
		public static readonly type = '[Ordered Service] SetState';

		public constructor(
			public readonly orderId: string,
			public readonly orderedServiceId: string,
			public readonly state: StateEnum,
		) {
		}
	}

	export class OrderedProductState {
		public static readonly type = '[Ordered Product] SetState';

		public constructor(
			public readonly orderId: string,
			public readonly orderedProductId: string,
			public readonly state: StateEnum,
		) {
		}
	}

	export class SetOrderedService {
		public static readonly type = '[Ordered Service] Set';

		public constructor(
			public readonly payload: {
				entity: EOrderService;
			},
		) {
		}
	}

	export class Checkout {
		public static readonly type = '[Order] Checkout';

		public constructor(
			public readonly payload: {
				orderId: string,
				selected?: {
					serviceIdList?: string[];
				};
			},
		) {
		}
	}

}
