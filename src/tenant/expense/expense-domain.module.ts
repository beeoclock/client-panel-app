import {importProvidersFrom, NgModule} from "@angular/core";
import {ExpenseModule} from "@tenant/expense/expense/expense.module";
import {ExpenseCategoryModule} from "@tenant/expense/expense-category/expense-category.module";

@NgModule({
	providers: [
		importProvidersFrom(
			ExpenseModule,
			ExpenseCategoryModule,
		)
	]
})
export class ExpenseDomainModule {


}
