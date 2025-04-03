import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ListPage} from "@shared/list.page";
import {TranslateModule} from "@ngx-translate/core";
import {DatePipe} from "@angular/common";
import {
	TableNgxDatatableSmartResource
} from "@src/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";
import {
	DesktopLayoutListComponent
} from "@tenant/order-service/presentation/ui/organism/list/layout/desktop/desktop.layout.list.component";
import {
	OrderServiceTableNgxDatatableResource
} from "@tenant/order-service/presentation/ui/page/list/order-service.table-ngx-datatable.resource";

@Component({
	selector: 'app-list-order-service-page',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		TranslateModule,
		DesktopLayoutListComponent,
	],
	providers: [
		DatePipe,
		{
			provide: TableNgxDatatableSmartResource,
			useClass: OrderServiceTableNgxDatatableResource,
		},
	],
	standalone: true,
	template: `
		<order-service-desktop-layout-list-component/>
	`,
})
export default class ListOrderServicePage extends ListPage implements OnInit {

	public override ngOnInit() {
		super.ngOnInit();
		this.analyticsService.logEvent('order_service_list_page_initialized');
	}

}
