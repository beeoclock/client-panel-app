import {inject, Injectable} from "@angular/core";
import {Action, State, StateContext} from "@ngxs/store";
import {baseDefaults, IBaseState} from "@shared/state/base/base.state";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {NGXLogger} from "ngx-logger";
import {IPayment} from "@tenant/payment/domain/interface/i.payment";
import {environment} from "@environment/environment";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {MemberPresentationActions} from "@tenant/member/infrastructure/state/presentation/member.presentation.actions";
import {IMemberPresentationState} from "@tenant/member/infrastructure/state/presentation/member.presentation.state";
import {
	PaymentPresentationActions
} from "@tenant/payment/infrastructure/state/presentation/payment.presentation.actions";
import {SecondRouterOutletService} from "@src/second.router-outlet.service";
import {Router} from "@angular/router";
import PaymentDetails from "@tenant/payment/presentation/ui/page/details/details";

export type IPaymentState = IBaseState<IPayment.DTO>;

const defaults = baseDefaults<IPayment.DTO>({
	filters: {},
	orderBy: OrderByEnum.CREATED_AT,
	orderDir: OrderDirEnum.DESC,
	pageSize: environment.config.pagination.pageSize
});

@State<IPaymentState>({
	name: 'paymentPresentation',
	defaults,
})
@Injectable()
export class PaymentPresentationState {

	private readonly sharedUow = inject(SharedUow);
	private readonly secondRouterOutletService = inject(SecondRouterOutletService);
	private readonly router = inject(Router);
	private readonly ngxLogger = inject(NGXLogger);

	@Action(MemberPresentationActions.CloseDetails)
	public async closeDetails() {

		await this.router.navigate([{outlets: {second: null}}]);

	}

	@Action(PaymentPresentationActions.OpenDetails)
	public async openDetails(ctx: StateContext<IMemberPresentationState>, {payload}: PaymentPresentationActions.OpenDetails) {

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
