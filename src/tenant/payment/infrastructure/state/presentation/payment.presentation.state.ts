import {inject, Injectable} from "@angular/core";
import {Action, State, StateContext} from "@ngxs/store";
import {
	PaymentPresentationActions
} from "@tenant/payment/infrastructure/state/presentation/payment.presentation.actions";
import {SecondRouterOutletService} from "@src/second.router-outlet.service";
import {Router} from "@angular/router";
import PaymentDetails from "@tenant/payment/presentation/ui/page/details/details";

export type IPaymentPresentationState = object;

const defaults = {};

@State<IPaymentPresentationState>({
	name: 'paymentPresentation',
	defaults,
})
@Injectable()
export class PaymentPresentationState {

	private readonly secondRouterOutletService = inject(SecondRouterOutletService);
	private readonly router = inject(Router);

	@Action(PaymentPresentationActions.CloseDetails)
	public async closeDetails() {

		await this.router.navigate([{outlets: {second: null}}]);

	}

	@Action(PaymentPresentationActions.OpenDetails)
	public async openDetails(ctx: StateContext<IPaymentPresentationState>, {payload}: PaymentPresentationActions.OpenDetails) {

		const activated = this.secondRouterOutletService.activated();

		if (activated) {
			if (activated instanceof PaymentDetails) {
				const {_id} = activated.item() ?? {};
				if (_id === payload._id) {
					ctx.dispatch(new PaymentPresentationActions.CloseDetails());
					return;
				}
			}
		}

		await this.router.navigate([{outlets: {second: ['payment', payload._id]}}]);

	}

}
