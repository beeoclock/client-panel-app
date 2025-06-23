import {inject, Injectable} from "@angular/core";
import {Action, State, StateContext} from "@ngxs/store";
import {Router} from "@angular/router";
import {SecondRouterOutletService} from "@src/second.router-outlet.service";
import {
	ExpenseCategoryPresentationActions
} from "@tenant/expense/expense-category/infrastructure/state/presentation/expense-category.presentation.actions";
import ExpenseCategoryDetailsContainerComponent
	from "@tenant/expense/expense-category/presentation/ui/component/details/expense-category-details-container.component";
import ExpenseCategoryFormContainerComponent
	from "@tenant/expense/expense-category/presentation/ui/component/form/expense-category-form-container.component";

export type IExpensePresentationState = object;

@State<IExpensePresentationState>({
	name: 'expenseCategoryPresentation',
	defaults: {},
})
@Injectable()
export class ExpenseCategoryPresentationState {

	private readonly secondRouterOutletService = inject(SecondRouterOutletService);
	private readonly router = inject(Router);


	@Action(ExpenseCategoryPresentationActions.CloseDetails)
	public async closeDetails() {
		await this.router.navigate([{outlets: {second: null}}]);
	}

	@Action(ExpenseCategoryPresentationActions.CloseForm)
	public async closeForm() {
		await this.router.navigate([{outlets: {second: null}}]);
	}

	@Action(ExpenseCategoryPresentationActions.UpdateOpenedDetails)
	public async updateOpenedDetails(ctx: StateContext<IExpensePresentationState>, {payload}: ExpenseCategoryPresentationActions.UpdateOpenedDetails) {

		const activated = this.secondRouterOutletService.activated();

		if (activated) {

			if (activated instanceof ExpenseCategoryDetailsContainerComponent) {

				const {_id} = activated.item() ?? {};

				if (_id === payload._id) {


					await this.router.navigate([{outlets: {second: ['expense-category', payload._id]}}], {
						onSameUrlNavigation: 'reload',
					});

				}

			}

		}

	}

	@Action(ExpenseCategoryPresentationActions.OpenDetails)
	public async openDetailsAction(ctx: StateContext<IExpensePresentationState>, {payload}: ExpenseCategoryPresentationActions.OpenDetails) {

		const activated = this.secondRouterOutletService.activated();

		if (activated) {
			if (activated instanceof ExpenseCategoryDetailsContainerComponent) {
				const {_id} = activated.item() ?? {};
				if (_id === payload._id) {
					const action = new ExpenseCategoryPresentationActions.CloseDetails();
					ctx.dispatch(action);
					return;
				}
			}
		}

		await this.router.navigate([{outlets: {second: ['expense-category', payload._id]}}]);

	}

	@Action(ExpenseCategoryPresentationActions.OpenForm)
	public async openForm(ctx: StateContext<IExpensePresentationState>, {payload}: ExpenseCategoryPresentationActions.OpenForm): Promise<void> {

		const activated = this.secondRouterOutletService.activated();

		if (activated) {
			if (activated instanceof ExpenseCategoryFormContainerComponent) {
				const isEditMode = activated.isEditMode();
				if (isEditMode) {
					const {_id} = activated.item() ?? {};
					if (_id === payload?.componentInputs?.item?._id) {
						const action = new ExpenseCategoryPresentationActions.CloseForm();
						ctx.dispatch(action);
						return;
					}
				} else {
					const action = new ExpenseCategoryPresentationActions.CloseForm();
					ctx.dispatch(action);
					return;
				}
			}
		}

		if (payload?.componentInputs?.isEditMode) {
			await this.router.navigate([{outlets: {second: ['expense-category', payload.componentInputs.item?._id, 'form']}}]);
		} else {
			await this.router.navigate([{outlets: {second: ['expense-category', 'form']}}]);
		}

	}

}
