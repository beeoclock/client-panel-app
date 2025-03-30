import {inject, Injectable} from "@angular/core";
import {Action, State, StateContext} from "@ngxs/store";
import {
	CustomerPresentationActions
} from "@tenant/customer/infrastructure/state/presentation/customer.presentation.actions";
import {Router} from "@angular/router";
import {SecondRouterOutletService} from "@src/second.router-outlet.service";
import CustomerDetailsContainerComponent
	from "@tenant/customer/presentation/ui/component/details/customer-details-container.component";
import CustomerFormContainerComponent
	from "@tenant/customer/presentation/ui/component/form/customer-form-container.component";

export type ICustomerPresentationState = object;

@State<ICustomerPresentationState>({
	name: 'customerPresentation',
	defaults: {},
})
@Injectable()
export class CustomerPresentationState {

	private readonly secondRouterOutletService = inject(SecondRouterOutletService);
	private readonly router = inject(Router);


	@Action(CustomerPresentationActions.CloseDetails)
	public async closeDetails() {

		await this.router.navigate([{outlets: {second: null}}]);

	}

	@Action(CustomerPresentationActions.CloseForm)
	public async closeForm() {

		await this.router.navigate([{outlets: {second: null}}]);
	}

	@Action(CustomerPresentationActions.UpdateOpenedDetails)
	public async updateOpenedDetails(ctx: StateContext<ICustomerPresentationState>, {payload}: CustomerPresentationActions.UpdateOpenedDetails) {

		await this.router.navigate([{outlets: {second: ['customer', payload._id]}}], {
			onSameUrlNavigation: 'reload',
		});

	}

	@Action(CustomerPresentationActions.OpenDetails)
	public async openDetailsAction(ctx: StateContext<ICustomerPresentationState>, {payload}: CustomerPresentationActions.OpenDetails) {

		const activated = this.secondRouterOutletService.activated();

		if (activated) {
			if (activated instanceof CustomerDetailsContainerComponent) {
				const {_id} = activated.item() ?? {};
				if (_id === payload._id) {
					const action = new CustomerPresentationActions.CloseDetails();
					ctx.dispatch(action);
					return;
				}
			}
		}

		await this.router.navigate([{outlets: {second: ['customer', payload._id]}}]);

	}

	@Action(CustomerPresentationActions.OpenForm)
	public async openForm(ctx: StateContext<ICustomerPresentationState>, {payload}: CustomerPresentationActions.OpenForm): Promise<void> {

		const activated = this.secondRouterOutletService.activated();

		if (activated) {
			if (activated instanceof CustomerFormContainerComponent) {
				const isEditMode = activated.isEditMode();
				if (isEditMode) {
					const {_id} = activated.item() ?? {};
					if (_id === payload?.componentInputs?.item?._id) {
						const action = new CustomerPresentationActions.CloseForm();
						ctx.dispatch(action);
						return;
					}
				} else {
					const action = new CustomerPresentationActions.CloseForm();
					ctx.dispatch(action);
					return;
				}
			}
		}

		if (payload?.componentInputs?.isEditMode) {
			await this.router.navigate([{outlets: {second: ['customer',  payload.componentInputs.item?._id, 'form']}}]);
		} else {
			await this.router.navigate([{outlets: {second: ['customer', 'form']}}]);
		}

	}

}
