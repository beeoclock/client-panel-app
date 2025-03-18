import {ChangeDetectionStrategy, Component, effect, inject, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ListPage} from "@utility/list.page";
import {CustomerState} from "@customer/infrastructure/state/customer/customer.state";
import {Observable, tap} from "rxjs";
import {ITableState} from "@utility/domain/table.state";
import {TranslateModule} from "@ngx-translate/core";
import {AsyncPipe, DatePipe} from "@angular/common";
import {TableService} from "@utility/table.service";
import {CustomerTableService} from "@customer/presentation/component/list/customer.table.service";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {CustomerActions} from "@customer/infrastructure/state/customer/customer.actions";
import {environment} from "@environment/environment";
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

	public readonly tableState$: Observable<ITableState<ECustomer>> = this.store.select(CustomerState.tableState)
		.pipe(
			tap((tableState) => {
				this.changeDetectorRef.detectChanges();
			})
		);

	public readonly tableNgxDatatableSmartResource = inject(TableNgxDatatableSmartResource)

	public constructor() {
		super();
		effect(() => {
			const filters = this.filters();
			this.tableNgxDatatableSmartResource.filters.set(filters);
		});
	}

	public override ngOnInit() {
		super.ngOnInit();
		this.analyticsService.logEvent('customer_list_page_initialized');
	}

	@Dispatch()
	public resetFilter() {
		return new CustomerActions.UpdateTableState({
			filters: {},
			orderBy: OrderByEnum.CREATED_AT,
			orderDir: OrderDirEnum.DESC,
			pageSize: environment.config.pagination.pageSize
		});
	}

	public override ngOnDestroy() {
		this.resetFilter();
		super.ngOnDestroy();
	}

}

export default ListCustomerPage;
