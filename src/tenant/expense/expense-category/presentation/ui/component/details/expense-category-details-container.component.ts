import {Component, inject, input, ViewEncapsulation} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {StandardDetailsEntityComponent} from "@shared/presentation/component/entity/standard-details.entity.component";
import EExpenseCategory from "@tenant/expense/expense-category/domain/entity/e.expense-category";

@Component({
	selector: 'expense-category-detail-page',
	templateUrl: './expense-category-details-container.component.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		TranslateModule,
		StandardDetailsEntityComponent
	],
	host: {
		class: 'bg-neutral-100'
	},
	standalone: true
})
export class ExpenseCategoryDetailsContainerComponent {

	// TODO add base index of details with store and delete method

	public readonly item = input.required<EExpenseCategory>();

	private readonly router = inject(Router);

}

export default ExpenseCategoryDetailsContainerComponent;
