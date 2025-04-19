import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ListPage} from "@shared/list.page";
import {TranslateModule} from "@ngx-translate/core";
import {AsyncPipe, DatePipe} from "@angular/common";
import {
	TableNgxDatatableSmartResource
} from "@shared/presentation/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";
import {
	BalanceTableNgxDatatableSmartResource
} from "@tenant/balance/presentation/ui/page/list/balance.table-ngx-datatable.resource";
import {
	DesktopLayoutListComponent
} from "@tenant/balance/presentation/ui/component/list/layout/desktop/desktop.layout.list.component";
import {
	MobileLayoutListComponent
} from "@tenant/balance/presentation/ui/component/list/layout/mobile/mobile.layout.list.component";

@Component({
	selector: 'app-list-customer-page',
	templateUrl: './list.balance.page.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		TranslateModule,
		AsyncPipe,
		DesktopLayoutListComponent,
		MobileLayoutListComponent,
	],
	standalone: true,
	providers: [
		DatePipe,
		{
			provide: TableNgxDatatableSmartResource,
			useClass: BalanceTableNgxDatatableSmartResource,
		},
	]
})
export class ListBalancePage extends ListPage implements OnDestroy, OnInit {


	public override ngOnInit() {
		super.ngOnInit();
		this.analyticsService.logEvent('balance_list_page_initialized');
	}

}

export default ListBalancePage;
