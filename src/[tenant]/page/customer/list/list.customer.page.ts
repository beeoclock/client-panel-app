import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ListPage} from "@utility/list.page";
import {TranslateModule} from "@ngx-translate/core";
import {AsyncPipe, DatePipe} from "@angular/common";
import {TableService} from "@utility/table.service";
import {CustomerTableService} from "@customer/presentation/component/list/customer.table.service";
import ECustomer from "@core/business-logic/customer/entity/e.customer";
import {
	TableNgxDatatableSmartResource
} from "@src/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";
import {
	MobileLayoutListComponent
} from "@customer/presentation/component/list/layout/mobile/mobile.layout.list.component";
import {
	DesktopLayoutListComponent
} from "@customer/presentation/component/list/layout/desktop/desktop.layout.list.component";
import {CustomerTableNgxDatatableSmartResource} from "@page/customer/list/customer.table-ngx-datatable.resource";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ofActionSuccessful} from "@ngxs/store";
import {CustomerActions} from "@customer/infrastructure/state/customer/customer.actions";
import {tap} from "rxjs";

@Component({
	selector: 'app-list-customer-page',
	templateUrl: './list.customer.page.html',
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
			provide: TableService,
			useClass: CustomerTableService
		},
		{
			provide: TableNgxDatatableSmartResource,
			useClass: CustomerTableNgxDatatableSmartResource,
		},
	]
})
export class ListCustomerPage extends ListPage<ECustomer> implements OnDestroy, OnInit {

	public readonly actionsSubscription = this.actions.pipe(
		takeUntilDestroyed(),
		ofActionSuccessful(
			CustomerActions.UpdateItem,
			CustomerActions.CreateItem,
			CustomerActions.SetState,
		),
		tap((payload) => {
			this.tableNgxDatatableSmartResource.refreshDiscoveredPages();
		})
	).subscribe();

	public override ngOnInit() {
		super.ngOnInit();
		this.analyticsService.logEvent('customer_list_page_initialized');
	}

}

export default ListCustomerPage;
