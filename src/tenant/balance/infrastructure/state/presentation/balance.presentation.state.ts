import {inject, Injectable} from "@angular/core";
import {Action, State, StateContext} from "@ngxs/store";
import {Router} from "@angular/router";
import {SecondRouterOutletService} from "@src/second.router-outlet.service";
import {
	BalancePresentationActions
} from "@tenant/balance/infrastructure/state/presentation/balance.presentation.actions";
import BalanceDetailsContainerComponent
	from "@tenant/balance/presentation/ui/component/details/balance-details-container.component";
import BalanceFormContainerComponent
	from "@tenant/balance/presentation/ui/component/form/balance-form-container.component";

export type IBalancePresentationState = object;

@State<IBalancePresentationState>({
	name: 'balancePresentation',
	defaults: {},
})
@Injectable()
export class BalancePresentationState {

	private readonly secondRouterOutletService = inject(SecondRouterOutletService);
	private readonly router = inject(Router);


	@Action(BalancePresentationActions.CloseDetails)
	public async closeDetails() {
		await this.router.navigate([{outlets: {second: null}}]);
	}

	@Action(BalancePresentationActions.CloseForm)
	public async closeForm() {
		await this.router.navigate([{outlets: {second: null}}]);
	}

	@Action(BalancePresentationActions.UpdateOpenedDetails)
	public async updateOpenedDetails(ctx: StateContext<IBalancePresentationState>, {payload}: BalancePresentationActions.UpdateOpenedDetails) {

		const activated = this.secondRouterOutletService.activated();

		if (activated) {

			if (activated instanceof BalanceDetailsContainerComponent) {

				const {_id} = activated.item() ?? {};

				if (_id === payload._id) {


					await this.router.navigate([{outlets: {second: ['balance', payload._id]}}], {
						onSameUrlNavigation: 'reload',
					});

				}

			}

		}

	}

	@Action(BalancePresentationActions.OpenDetails)
	public async openDetailsAction(ctx: StateContext<IBalancePresentationState>, {payload}: BalancePresentationActions.OpenDetails) {

		const activated = this.secondRouterOutletService.activated();

		if (activated) {
			if (activated instanceof BalanceDetailsContainerComponent) {
				const {_id} = activated.item() ?? {};
				if (_id === payload._id) {
					const action = new BalancePresentationActions.CloseDetails();
					ctx.dispatch(action);
					return;
				}
			}
		}

		await this.router.navigate([{outlets: {second: ['balance', payload._id]}}]);

	}

	@Action(BalancePresentationActions.OpenForm)
	public async openForm(ctx: StateContext<IBalancePresentationState>, {payload}: BalancePresentationActions.OpenForm): Promise<void> {

		const activated = this.secondRouterOutletService.activated();

		if (activated) {
			if (activated instanceof BalanceFormContainerComponent) {
				const action = new BalancePresentationActions.CloseForm();
				ctx.dispatch(action);
				return;
			}
		}

		await this.router.navigate([{outlets: {second: ['balance', 'form']}}]);

	}

}
