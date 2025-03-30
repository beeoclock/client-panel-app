import {BaseActions} from "@utility/state/base/base.actions";
import {IPayment} from "@core/business-logic/payment/interface/i.payment";

export namespace PaymentActions {

	export class CreateItem extends BaseActions.CreateItem<IPayment.DTO> {
		public static override readonly type = '[Payment API] Create Item';
	}

	export class Update {
		public static readonly type = '[Payment API] Put Item';

		public constructor(
			public readonly payload: { item: IPayment.DTO }
		) {
		}
	}

}
