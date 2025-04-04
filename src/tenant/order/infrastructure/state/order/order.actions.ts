import {BaseActions} from "@shared/state/base/base.actions";
import {ICustomer} from "@tenant/customer/domain";
import {OrderStatusEnum} from "@tenant/order/domain/enum/order.status.enum";
import {IService} from "@tenant/service/domain/interface/i.service";
import {IOrder} from "@tenant/order/domain/interface/i.order";
import {IMember} from "@tenant/member/domain/interface/i.member";
import EOrder from "@tenant/order/domain/entity/e.order";
import {StateEnum} from "@core/shared/enum/state.enum";
import {OrderServiceStatusEnum} from "@tenant/order/domain/enum/order-service.status.enum";

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

	export class GetList extends BaseActions.GetList {
		public static override readonly type = '[Order API] Get List';
	}

	export class GetItem extends BaseActions.GetItem {
		public static override readonly type = '[Order API] Get Item';
	}

	export class CreateItem extends BaseActions.CreateItem<IOrder.EntityRaw> {
		public static override readonly type = '[Order API] Create Item';
	}

	export class UpdateItem extends BaseActions.UpdateItem<IOrder.EntityRaw> {
		public static override readonly type = '[Order API] Update Item';
	}

	// Updates of state

	export class UpdateFilters extends BaseActions.UpdateFilters {
		public static override readonly type = '[Order State] Update Filters';
	}

	export class UpdateTableState extends BaseActions.UpdateTableState<EOrder> {
		public static override readonly type = '[Order State] Update Table State';
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
		public static readonly type = '[Order API] SetState';

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
