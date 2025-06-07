import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ListPage} from "@shared/list.page";
import {TranslateModule} from "@ngx-translate/core";
import {AsyncPipe, DatePipe} from "@angular/common";
import {
	TableNgxDatatableSmartResource
} from "@shared/presentation/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ofActionSuccessful} from "@ngxs/store";
import {tap} from "rxjs";
import {ExpenseDataActions} from "@tenant/expense/expense/infrastructure/state/data/expense.data.actions";
import {
	ExpenseTableNgxDatatableSmartResource
} from "@tenant/expense/expense/presentation/ui/page/list/expense.table-ngx-datatable.resource";
import {
	MobileLayoutListComponent
} from "@tenant/expense/expense/presentation/ui/component/list/layout/mobile/mobile.layout.list.component";
import {
	DesktopLayoutListComponent
} from "@tenant/expense/expense/presentation/ui/component/list/layout/desktop/desktop.layout.list.component";

@Component({
	selector: 'app-list-expense-page',
	templateUrl: './list.expense.page.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		TranslateModule,
		AsyncPipe,
		MobileLayoutListComponent,
		DesktopLayoutListComponent,
	],
	standalone: true,
	providers: [
		DatePipe,
		{
			provide: TableNgxDatatableSmartResource,
			useClass: ExpenseTableNgxDatatableSmartResource,
		},
	]
})
export class ListExpensePage extends ListPage implements OnDestroy, OnInit {

	public readonly actionsSubscription = this.actions.pipe(
		takeUntilDestroyed(),
		ofActionSuccessful(
			ExpenseDataActions.UpdateItem,
			ExpenseDataActions.CreateItem,
			ExpenseDataActions.SetState,
		),
		tap((payload) => {
			this.tableNgxDatatableSmartResource?.refreshDiscoveredPages();
		})
	).subscribe();

	public override ngOnInit() {
		super.ngOnInit();
		this.analyticsService.logEvent('expense_list_page_initialized');
	}

}

export default ListExpensePage;
