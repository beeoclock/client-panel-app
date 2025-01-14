import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {ListPage} from "@utility/list.page";
import {CustomerState} from "@customer/state/customer/customer.state";
import {Observable, tap} from "rxjs";
import {ICustomer} from "@customer/domain";
import {ITableState} from "@utility/domain/table.state";
import {TranslateModule} from "@ngx-translate/core";
import {AsyncPipe} from "@angular/common";
import {
	DesktopLayoutListComponent
} from "@customer/presentation/component/list/layout/desktop/desktop.layout.list.component";
import {
	MobileLayoutListComponent
} from "@customer/presentation/component/list/layout/mobile/mobile.layout.list.component";
import {TableService} from "@utility/table.service";
import {CustomerTableService} from "@customer/presentation/component/list/customer.table.service";

@Component({
	selector: 'app-list-customer-page',
	templateUrl: './list.customer.page.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		TranslateModule,
		AsyncPipe,
		DesktopLayoutListComponent,
		MobileLayoutListComponent,
		DesktopLayoutListComponent,
		MobileLayoutListComponent,
	],
	standalone: true,
	providers: [
		{
			provide: TableService,
			useClass: CustomerTableService
		}
	]
})
export class ListCustomerPage extends ListPage<ICustomer> {

	public readonly tableState$: Observable<ITableState<ICustomer>> = this.store.select(CustomerState.tableState)
		.pipe(
			tap((tableState) => {
				this.changeDetectorRef.detectChanges();
			})
		);

	public override ngOnInit() {
		super.ngOnInit();
		this.analyticsService.logEvent('customer_list_page_initialized');
	}

}

export default ListCustomerPage;
