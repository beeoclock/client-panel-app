import {Component, inject, input, ViewEncapsulation} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {StandardDetailsEntityComponent} from "@shared/presentation/component/entity/standard-details.entity.component";
import EExpense from "@tenant/expense/expense/domain/entity/e.expense";

@Component({
	selector: 'expense-detail-page',
	templateUrl: './expense-details-container.component.html',
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
export class ExpenseDetailsContainerComponent {

	// TODO add base index of details with store and delete method

	public readonly item = input.required<EExpense>();

	private readonly router = inject(Router);
}

export default ExpenseDetailsContainerComponent;
