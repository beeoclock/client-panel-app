import {ChangeDetectionStrategy, Component, ViewEncapsulation} from "@angular/core";
import {AsyncPipe} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {TableComponent} from "@shared/table.component";
import {CardComponent} from "@shared/presentation/component/card/card.component";
import {NoDataPipe} from "@shared/presentation/pipes/no-data.pipe";
import {BooleanStreamState} from "@shared/domain/boolean-stream.state";
import {
	CardIonListSmartComponent
} from "@shared/presentation/component/smart/card-ion-list/card-ion-list.smart.component";
import {
	NotFoundTableDataComponent
} from "@shared/presentation/component/not-found-table-data/not-found-table-data.component";
import {
	AutoRefreshButtonComponent
} from "@tenant/customer/presentation/ui/component/button/auto-refresh/auto-refresh.button.component";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import EExpenseCategory from "@tenant/expense/expense-category/domain/entity/e.expense-category";
import {
	ExpenseCategoryPresentationActions
} from "@tenant/expense/expense-category/infrastructure/state/presentation/expense-category.presentation.actions";

@Component({
	selector: 'expense-category-card-list-component',
	templateUrl: './card.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		TranslateModule,
		CardComponent,
		NoDataPipe,
		AsyncPipe,
		CardIonListSmartComponent,
		NotFoundTableDataComponent,
		AutoRefreshButtonComponent
	],
	host: {
		class: 'block flex-1'
	},
})
export class CardListComponent extends TableComponent<EExpenseCategory> {

	public showAction = new BooleanStreamState(true);

	public showSelectedStatus = new BooleanStreamState(false);

	public override open(item: EExpenseCategory) {
		this.store.dispatch(new ExpenseCategoryPresentationActions.OpenDetails(item));
	}

	@Dispatch()
	public openForm() {
		return new ExpenseCategoryPresentationActions.OpenForm();
	}

}
