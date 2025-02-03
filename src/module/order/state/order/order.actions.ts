import {BaseActions} from "@utility/state/base/base.actions";
import {IOrderDto} from "@order/external/interface/details/i.order.dto";
import {RIMember} from "@member/domain";
import {IOrderServiceDto} from "@order/external/interface/i.order-service.dto";
import {OrderStatusEnum} from "@order/domain/enum/order.status.enum";
import {IServiceDto} from "@order/external/interface/i.service.dto";
import {ICustomer} from "@customer/domain";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace OrderActions {

	// Application layer

	export class CloseDetails extends BaseActions.CloseDetails {
		public static override readonly type = '[Order Application] Close Details';
	}

	export class CloseForm extends BaseActions.CloseForm {
		public static override readonly type = '[Order Application] Close Form';
	}

	export class UpdateOpenedDetails extends BaseActions.UpdateOpenedDetails<IOrderDto> {
		public static override readonly type = '[Order Application] Update Opened Details';
	}

	export class OpenDetails extends BaseActions.OpenDetails<IOrderDto> {
		public static override readonly type = '[Order Application] Open Details';
	}

	export class OpenDetailsById extends BaseActions.OpenDetailsById {
		public static override readonly type = '[Order Application] Open Details By Id';
	}

	export class OpenOrderServiceForm {
		public static readonly type = '[Order Application] Open Order Service Form';

		public constructor(
			public readonly payload: {
				orderId: string;
				isEditMode?: boolean;
				item?: Partial<IOrderServiceDto>;
			}
		) {
		}
	}

	export class OpenFormToEditById extends BaseActions.OpenFormToEditById {
		public static override readonly type = '[Order Application] Open Form To Edit By Id';
	}

	export class OpenForm extends BaseActions.OpenForm<{
		isEditMode?: boolean;
		item?: IOrderDto;
		setupPartialData?: {
			defaultAppointmentStartDateTimeIso?: string;
			defaultMemberForService?: RIMember;
			serviceList?: IServiceDto[];
			customer?: ICustomer.DTO;
		};
	}> {
		public static override readonly type = '[Order Application] Open Form';
	}

	// API

	export class Init extends BaseActions.Init {
		public static override readonly type = '[Service State] Init';
	}

	export class GetList extends BaseActions.GetList {
		public static override readonly type = '[Order API] Get List';
	}

	export class DeleteItem extends BaseActions.DeleteItem {
		public static override readonly type = '[Order API] Delete Item';
	}

	export class GetItem extends BaseActions.GetItem {
		public static override readonly type = '[Order API] Get Item';
	}

	export class CreateItem extends BaseActions.CreateItem<IOrderDto> {
		public static override readonly type = '[Order API] Create Item';
	}

	export class UpdateItem extends BaseActions.UpdateItem<IOrderDto> {
		public static override readonly type = '[Order API] Update Item';
	}

	export class PutItem {
		public static readonly type = '[Order API] Put Item';

		public constructor(
			public readonly payload: {
				item: IOrderDto;
			}
		) {
		}
	}

	// Updates of state

	export class UpdateFilters extends BaseActions.UpdateFilters {
		public static override readonly type = '[Order State] Update Filters';
	}

	export class UpdateTableState extends BaseActions.UpdateTableState<IOrderDto> {
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

}
