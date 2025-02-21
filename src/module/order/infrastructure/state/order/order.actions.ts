import {BaseActions} from "@utility/state/base/base.actions";
import {ICustomer} from "@src/core/business-logic/customer";
import {OrderStatusEnum} from "@src/core/business-logic/order/enum/order.status.enum";
import {IService} from "@core/business-logic/service/interface/i.service";
import {IOrder} from "@core/business-logic/order/interface/i.order";
import {IMember} from "@core/business-logic/member/interface/i.member";
import EOrder from "@core/business-logic/order/entity/e.order";

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

	export class OpenDetailsById extends BaseActions.OpenDetailsById {
		public static override readonly type = '[Order Application] Open Details By Id';
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
		public static override readonly type = '[Service State] Init';
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

	export class PutItem {
		public static readonly type = '[Order API] Put Item';

		public constructor(
			public readonly payload: {
				item: IOrder.DTO;
			}
		) {
		}
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

	export class Delete {
		public static readonly type = '[Order] Delete';

		public constructor(
			public readonly payload: {
				id: string;
			}
		) {
		}
	}

}
