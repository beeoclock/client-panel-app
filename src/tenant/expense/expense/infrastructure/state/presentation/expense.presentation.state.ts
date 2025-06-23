import {inject, Injectable} from "@angular/core";
import {Action, State, StateContext} from "@ngxs/store";
import {Router} from "@angular/router";
import {SecondRouterOutletService} from "@src/second.router-outlet.service";
import {
	ExpensePresentationActions
} from "@tenant/expense/expense/infrastructure/state/presentation/expense.presentation.actions";
import ExpenseFormContainerComponent
	from "@tenant/expense/expense/presentation/ui/component/form/expense-form-container.component";
import ExpenseDetailsContainerComponent
	from "@tenant/expense/expense/presentation/ui/component/details/expense-details-container.component";

export type IExpensePresentationState = object;

@State<IExpensePresentationState>({
	name: 'expensePresentation',
	defaults: {},
})
@Injectable()
export class ExpensePresentationState {

	private readonly secondRouterOutletService = inject(SecondRouterOutletService);
	private readonly router = inject(Router);


	@Action(ExpensePresentationActions.CloseDetails)
	public async closeDetails() {
		await this.router.navigate([{outlets: {second: null}}]);
	}

	@Action(ExpensePresentationActions.CloseForm)
	public async closeForm() {
		await this.router.navigate([{outlets: {second: null}}]);
	}

	@Action(ExpensePresentationActions.UpdateOpenedDetails)
	public async updateOpenedDetails(ctx: StateContext<IExpensePresentationState>, {payload}: ExpensePresentationActions.UpdateOpenedDetails) {

		const activated = this.secondRouterOutletService.activated();

		if (activated) {

			if (activated instanceof ExpenseDetailsContainerComponent) {

				const {_id} = activated.item() ?? {};

				if (_id === payload._id) {


					await this.router.navigate([{outlets: {second: ['expense', payload._id]}}], {
						onSameUrlNavigation: 'reload',
					});

				}

			}

		}

	}

	@Action(ExpensePresentationActions.OpenDetails)
	public async openDetailsAction(ctx: StateContext<IExpensePresentationState>, {payload}: ExpensePresentationActions.OpenDetails) {

		const activated = this.secondRouterOutletService.activated();

		if (activated) {
			if (activated instanceof ExpenseDetailsContainerComponent) {
				const {_id} = activated.item() ?? {};
				if (_id === payload._id) {
					const action = new ExpensePresentationActions.CloseDetails();
					ctx.dispatch(action);
					return;
				}
			}
		}

		await this.router.navigate([{outlets: {second: ['expense', payload._id]}}]);

	}

	@Action(ExpensePresentationActions.OpenForm)
	public async openForm(ctx: StateContext<IExpensePresentationState>, {payload}: ExpensePresentationActions.OpenForm): Promise<void> {

		const activated = this.secondRouterOutletService.activated();

		if (activated) {
			if (activated instanceof ExpenseFormContainerComponent) {
				const isEditMode = activated.isEditMode();
				if (isEditMode) {
					const {_id} = activated.item() ?? {};
					if (_id === payload?.componentInputs?.item?._id) {
						const action = new ExpensePresentationActions.CloseForm();
						ctx.dispatch(action);
						return;
					}
				} else {
					const action = new ExpensePresentationActions.CloseForm();
					ctx.dispatch(action);
					return;
				}
			}
		}

		if (payload?.componentInputs?.isEditMode) {
			await this.router.navigate([{outlets: {second: ['expense', payload.componentInputs.item?._id, 'form']}}]);
		} else {
			await this.router.navigate([{outlets: {second: ['expense', 'form']}}]);
		}

	}

}
