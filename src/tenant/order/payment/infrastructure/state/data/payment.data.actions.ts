import {BaseActions} from "@shared/state/base/base.actions";
import {IPayment} from "@tenant/order/payment/domain/interface/i.payment";
import {PaymentFormValue} from "@tenant/order/payment/presentation/form/payment.form";

export namespace PaymentDataActions {

	export class CreateItem extends BaseActions.CreateItem<PaymentFormValue> {
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
