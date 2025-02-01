import {ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ListPage} from "@utility/list.page";
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
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {OrderByEnum, OrderDirEnum} from "@utility/domain/enum";
import ECustomer from "@core/entity/e.customer";
import {toObservable} from "@angular/core/rxjs-interop";
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
export class ListCustomerPage extends ListPage<ICustomer> implements OnDestroy, OnInit {


	private readonly customerStore = inject(ECustomer.store);
	public readonly tableState$: Observable<ITableState<ICustomer>> = toObservable(this.customerStore.tableState)
		.pipe(
			tap((tableState) => {
				this.changeDetectorRef.detectChanges();
			})
		);

	public override ngOnInit() {
		super.ngOnInit();
		this.analyticsService.logEvent('customer_list_page_initialized');
	}

	@Dispatch()
	public resetFilter() {
		return this.customerStore.updateTableState({
			filters: {},
			orderBy: OrderByEnum.CREATED_AT,
			orderDir: OrderDirEnum.DESC,
			pageSize: 20
		});
	}

	public override ngOnDestroy() {
		this.resetFilter();
		super.ngOnDestroy();
	}

}

export default ListCustomerPage;
