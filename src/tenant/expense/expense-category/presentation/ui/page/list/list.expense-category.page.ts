import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ListPage} from "@shared/list.page";
import {TranslateModule} from "@ngx-translate/core";
import {AsyncPipe, DatePipe} from "@angular/common";
import {
	TableNgxDatatableSmartResource
} from "@shared/presentation/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";
import {
	MobileLayoutListComponent
} from "@tenant/customer/presentation/ui/component/list/layout/mobile/mobile.layout.list.component";
import {
	DesktopLayoutListComponent
} from "@tenant/customer/presentation/ui/component/list/layout/desktop/desktop.layout.list.component";
import {
	ExpanseCategoryTableNgxDatatableSmartResource
} from "@tenant/expense/expense-category/presentation/ui/page/list/expense-category.table-ngx-datatable.resource";

@Component({
	selector: 'app-list-customer-page',
	templateUrl: './list.expense-category.page.html',
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
			useClass: ExpanseCategoryTableNgxDatatableSmartResource,
		},
	]
})
export class ListExpenseCategoryPage extends ListPage implements OnDestroy, OnInit {

	public override ngOnInit() {
		super.ngOnInit();
		this.analyticsService.logEvent('expense_category_list_page_initialized');
	}

}

export default ListExpenseCategoryPage;
