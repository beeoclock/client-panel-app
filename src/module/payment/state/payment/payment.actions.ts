import {BaseActions} from "@utility/state/base/base.actions";
import {IPaymentDto} from "@module/payment/domain/interface/dto/i.payment.dto";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace PaymentActions {

	// Application layer

	export class CloseDetails extends BaseActions.CloseDetails {
		public static override readonly type = '[Payment Application] Close Details';
	}

	export class CloseForm extends BaseActions.CloseForm {
		public static override readonly type = '[Payment Application] Close Form';
	}

	export class UpdateOpenedDetails extends BaseActions.UpdateOpenedDetails<IPaymentDto> {
		public static override readonly type = '[Payment Application] Update Opened Details';
	}

	export class OpenDetails extends BaseActions.OpenDetails<IPaymentDto> {
		public static override readonly type = '[Payment Application] Open Details';
	}

	export class OpenDetailsById extends BaseActions.OpenDetailsById {
		public static override readonly type = '[Payment Application] Open Details By Id';
	}

	export class OpenFormToEditById extends BaseActions.OpenFormToEditById {
		public static override readonly type = '[Payment Application] Open Form To Edit By Id';
	}

	export class OpenForm extends BaseActions.OpenForm<{
		isEditMode?: boolean;
		item?: IPaymentDto;
	}> {
		public static override readonly type = '[Payment Application] Open Form';
	}

	// API

	export class Init extends BaseActions.Init {
		public static override readonly type = '[Service State] Init';
	}

	export class GetList extends BaseActions.GetList {
		public static override readonly type = '[Payment API] Get List';
	}

	export class DeleteItem extends BaseActions.DeleteItem {
		public static override readonly type = '[Payment API] Delete Item';
	}

	export class GetItem extends BaseActions.GetItem {
		public static override readonly type = '[Payment API] Get Item';
	}

	export class CreateItem extends BaseActions.CreateItem<IPaymentDto> {
		public static override readonly type = '[Payment API] Create Item';
	}

	export class UpdateItem extends BaseActions.UpdateItem<IPaymentDto> {
		public static override readonly type = '[Payment API] Update Item';
	}

	export class PutItem {
		public static readonly type = '[Payment API] Put Item';

		constructor(
			public readonly payload: { item: IPaymentDto }
		) {
		}
	}

	// Updates of state

	export class UpdateFilters extends BaseActions.UpdateFilters {
		public static override readonly type = '[Payment State] Update Filters';
	}

	export class UpdateTableState extends BaseActions.UpdateTableState<IPaymentDto> {
		public static override readonly type = '[Payment State] Update Table State';
	}

}
