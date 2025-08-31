import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ListPage} from "@shared/list.page";
import {TranslateModule} from "@ngx-translate/core";
import {DatePipe} from "@angular/common";
import {
	TableNgxDatatableSmartResource
} from "@shared/presentation/ui/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";
import {
	MobileLayoutListComponent
} from "@tenant/customer/presentation/ui/component/list/layout/mobile/mobile.layout.list.component";
import {
	DesktopLayoutListComponent
} from "@tenant/customer/presentation/ui/component/list/layout/desktop/desktop.layout.list.component";
import {
	CustomerTableNgxDatatableSmartResource
} from "@tenant/customer/presentation/ui/page/list/customer.table-ngx-datatable.resource";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ofActionSuccessful} from "@ngxs/store";
import {tap} from "rxjs";
import {CustomerDataActions} from "@tenant/customer/infrastructure/state/data/customer.data.actions";
import {AppIfDeviceDirective, AppIfNotDeviceDirective} from "@shared/presentation/directives/device";

@Component({
	selector: 'app-list-customer-page',
	templateUrl: './list.customer.page.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		TranslateModule,
		MobileLayoutListComponent,
		DesktopLayoutListComponent,
		AppIfDeviceDirective,
		AppIfNotDeviceDirective,
	],
	standalone: true,
	providers: [
		DatePipe,
		{
			provide: TableNgxDatatableSmartResource,
			useClass: CustomerTableNgxDatatableSmartResource,
		},
	]
})
export class ListCustomerPage extends ListPage implements OnInit {

	public readonly actionsSubscription = this.actions.pipe(
		takeUntilDestroyed(),
		ofActionSuccessful(
			CustomerDataActions.UpdateItem,
			CustomerDataActions.CreateItem,
			CustomerDataActions.SetState,
		),
		tap((payload) => {
			this.tableNgxDatatableSmartResource?.refreshDiscoveredPages();
		})
	).subscribe();

	public ngOnInit() {
		this.analyticsService.logEvent('customer_list_page_initialized');
	}

}

export default ListCustomerPage;
