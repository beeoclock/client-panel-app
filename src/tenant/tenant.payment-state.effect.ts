import {inject, Injectable} from "@angular/core";
import {Actions, ofActionSuccessful, Store} from "@ngxs/store";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {OrderActions} from "@tenant/order/order/infrastructure/state/order/order.actions";
import {PaymentDataActions} from "@tenant/order/payment/infrastructure/state/data/payment.data.actions";
import {StateEnum} from "@core/shared/enum/state.enum";
import EPayment from "@tenant/order/payment/domain/entity/e.payment";

@Injectable()
export class TenantPaymentStateEffect {

	private readonly store = inject(Store);
	private readonly actions$ = inject(Actions);
	private readonly sharedUow = inject(SharedUow);

	private readonly orderUpdateCase = this.actions$.pipe(
		ofActionSuccessful(
			OrderActions.UpdateItem,
		),
	).subscribe((action) => {
		console.log('orderUpdateCase: ', action);
		const {payload} = action;
		if (payload.state !== StateEnum.active) {
			this.updatePaymentState(payload._id, payload.state);
		}
	})

	private readonly orderChangeStateCase = this.actions$.pipe(
		ofActionSuccessful(
			OrderActions.SetState,
		),
	).subscribe((action) => {
		console.log('orderChangeStateCase: ', action);
		const {item, state} = action;
		if (state !== StateEnum.active) {
			this.updatePaymentState(item._id, state);
		}
	})

	private readonly orderServiceChangeStateCase = this.actions$.pipe(
		ofActionSuccessful(
			OrderActions.OrderedServiceState,
		),
	).subscribe((payload) => {
		console.log('orderSetStateCase: ', payload);
		this.sharedUow.order.repository.findByIdAsync(payload.orderId).then((order) => {
			if (order) {
				this.updatePaymentState(order._id, order.state);
			}
		});
	});

	private updatePaymentState(orderId: string, orderState: StateEnum) {
		console.log('updatePaymentState: ', orderId, orderState);
		this.sharedUow.payment.findByOrderId(orderId).then((payment) => {
			payment.forEach((item) => {
				const entity = EPayment.fromRaw(item);
				entity.changeState(orderState);
				const action = new PaymentDataActions.Update({
					item: entity
				});
				this.store.dispatch(action);
			})
		});
	}

}
