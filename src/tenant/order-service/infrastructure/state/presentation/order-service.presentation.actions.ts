import {BaseActions} from "@shared/state/base/base.actions";
import {IOrderService} from "@tenant/order-service/domain/interface/i.order-service.dto";

export namespace OrderServicePresentationActions {

	export class CloseDetails extends BaseActions.CloseDetails {
		public static override readonly type = '[Order Service Presentation Application] Close Details';
	}

	export class CloseForm extends BaseActions.CloseForm {
		public static override readonly type = '[Order Service Presentation Application] Close Form';
	}

	export class UpdateOpenedDetails extends BaseActions.UpdateOpenedDetails<IOrderService.DTO> {
		public static override readonly type = '[Order Service Presentation Application] Update Opened Details';
	}

	export class OpenDetails extends BaseActions.OpenDetails<IOrderService.DTO> {
		public static override readonly type = '[Order Service Presentation Application] Open Details';
	}

	export class OpenFormToEditById extends BaseActions.OpenFormToEditById {
		public static override readonly type = '[Order Service Presentation Application] Open Form To Edit By Id';
	}


}
