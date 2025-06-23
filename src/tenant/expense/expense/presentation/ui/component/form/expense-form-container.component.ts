import {Component, inject, input, OnInit, ViewEncapsulation} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {validCustomer} from "@tenant/customer/domain";
import {TranslateModule} from "@ngx-translate/core";
import {firstValueFrom} from "rxjs";
import {Store} from "@ngxs/store";
import {CardComponent} from "@shared/presentation/component/card/card.component";
import {PrimaryButtonDirective} from "@shared/presentation/directives/button/primary.button.directive";
import {InvalidTooltipComponent} from "@shared/presentation/component/invalid-message/invalid-message";
import {
	ButtonSaveContainerComponent
} from "@shared/presentation/component/container/button-save/button-save.container.component";
import {NGXLogger} from "ngx-logger";
import {ExpenseDataActions} from "@tenant/expense/expense/infrastructure/state/data/expense.data.actions";
import {IExpense} from "@tenant/expense/expense/domain";
import {
	ExpensePresentationActions
} from "@tenant/expense/expense/infrastructure/state/presentation/expense.presentation.actions";
import {ExpenseForm} from "@tenant/expense/expense/presentation/form/expense.form";

@Component({
	selector: 'expense-form-page',
	templateUrl: './expense-form-container.component.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		ReactiveFormsModule,
		TranslateModule,
		CardComponent,
		PrimaryButtonDirective,
		InvalidTooltipComponent,
		ButtonSaveContainerComponent,
	],
	standalone: true
})
export class ExpenseFormContainerComponent implements OnInit {

	// TODO move functions to store effects/actions

	private readonly store = inject(Store);
	private readonly ngxLogger = inject(NGXLogger);

	public readonly form = ExpenseForm.create();

	public readonly item = input<IExpense.DTO | undefined>();

	public readonly isEditMode = input<boolean>(false);

	public ngOnInit(): void {
		this.detectItem();
	}

	public detectItem(): void {
		const item = this.item();
		if (this.isEditMode() && item) {
			this.form.patchValue({
				...item,
			});
			this.form.updateValueAndValidity();
		}
	}

	public async save(): Promise<void> {
		this.form.markAllAsTouched();
		const value = this.form.getRawValue() as IExpense.DTO;
		const validStatus = validCustomer(value);
		if (!(validStatus.success) && validStatus.errors.length) {
			this.ngxLogger.error('Object is invalid', validStatus);
			return;
		}
		if (this.form.valid) {
			this.form.disable();
			this.form.markAsPending();
			const actions: any[] = [
				new ExpensePresentationActions.CloseForm(),
			]
			if (this.isEditMode()) {
				actions.unshift(new ExpenseDataActions.UpdateItem(value));
			} else {
				actions.unshift(new ExpenseDataActions.CreateItem(value));
			}
			const action$ = this.store.dispatch(actions);
			await firstValueFrom(action$);
			this.form.enable();
			this.form.updateValueAndValidity();

		} else {
			this.ngxLogger.error('Form is invalid', this.form);
		}
	}
}

export default ExpenseFormContainerComponent;
