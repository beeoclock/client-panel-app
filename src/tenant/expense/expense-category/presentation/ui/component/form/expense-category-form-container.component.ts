import {afterNextRender, Component, inject, input, ViewEncapsulation} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from "@ngx-translate/core";
import {firstValueFrom} from "rxjs";
import {Store} from "@ngxs/store";
import {CardComponent} from "@shared/presentation/component/card/card.component";
import {PrimaryButtonDirective} from "@shared/presentation/directives/button/primary.button.directive";
import {InvalidTooltipComponent} from "@shared/presentation/component/invalid-message/invalid-message";
import {
	ButtonSaveContainerComponent
} from "@shared/presentation/component/container/button-save/button-save.container.component";
import {NgComponentOutlet, NgForOf} from "@angular/common";
import {NGXLogger} from "ngx-logger";
import {ExpenseCategoryForm} from "@tenant/expense/expense-category/presentation/form/expense-category.form";
import {
	ExpenseCategoryPresentationActions
} from "@tenant/expense/expense-category/infrastructure/state/presentation/expense-category.presentation.actions";
import {
	ExpenseCategoryDataActions
} from "@tenant/expense/expense-category/infrastructure/state/data/expense-category.data.actions";
import {IExpenseCategory} from "@tenant/expense/expense-category/domain";

@Component({
	selector: 'customer-form-page',
	templateUrl: './expense-category-form-container.component.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		ReactiveFormsModule,
		TranslateModule,
		CardComponent,
		PrimaryButtonDirective,
		InvalidTooltipComponent,
		ButtonSaveContainerComponent,
		NgComponentOutlet,
		NgForOf,
	],
	standalone: true
})
export class ExpenseCategoryFormContainerComponent {

	// TODO move functions to store effects/actions

	private readonly store = inject(Store);
	private readonly ngxLogger = inject(NGXLogger);

	public readonly form = ExpenseCategoryForm.create();

	public readonly item = input<IExpenseCategory.EntityRaw | undefined>();

	public readonly isEditMode = input<boolean>(false);

	public constructor() {
		afterNextRender(() => {
			this.detectItem();
		});
	}

	public detectItem(): void {
		const item = this.item();
		if (this.isEditMode() && item) {
			this.form.patchValue(item);
			this.form.updateValueAndValidity();
		}
	}

	public async save(): Promise<void> {
		this.form.markAllAsTouched();
		const value = this.form.getRawValue() as IExpenseCategory.EntityRaw;
		if (this.form.valid) {
			this.form.disable();
			this.form.markAsPending();
			const actions: any[] = [
				new ExpenseCategoryPresentationActions.CloseForm(),
			]
			if (this.isEditMode()) {
				actions.unshift(new ExpenseCategoryDataActions.UpdateItem(value));
			} else {
				actions.unshift(new ExpenseCategoryDataActions.CreateItem(value));
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

export default ExpenseCategoryFormContainerComponent;
