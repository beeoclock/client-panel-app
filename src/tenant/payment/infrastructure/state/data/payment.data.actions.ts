import {BaseActions} from "@shared/state/base/base.actions";
import {IPayment} from "@tenant/payment/domain/interface/i.payment";

export namespace PaymentDataActions {

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
