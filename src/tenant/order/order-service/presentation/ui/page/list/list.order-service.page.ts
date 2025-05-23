import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ListPage} from "@shared/list.page";
import {TranslateModule} from "@ngx-translate/core";
import {DatePipe} from "@angular/common";
import {
	DesktopLayoutListComponent
} from "@tenant/order/order-service/presentation/ui/organism/list/layout/desktop/desktop.layout.list.component";
import {
	OrderServiceTableNgxDatatableResource
} from "@tenant/order/order-service/presentation/ui/page/list/order-service.table-ngx-datatable.resource";
import {
	TableNgxDatatableSmartResource
} from "@shared/presentation/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";
import {ofActionSuccessful} from "@ngxs/store";
import {OrderActions} from "@tenant/order/order/infrastructure/state/order/order.actions";
import {tap} from "rxjs/operators";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

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

	private readonly actionsSubscription = this.actions.pipe(
		takeUntilDestroyed(),
		ofActionSuccessful(
			OrderActions.OrderedServiceState,
			OrderActions.OrderedServiceStatus,
			OrderActions.UpdateItem,
			OrderActions.ChangeStatus,
			OrderActions.SetState,
			OrderActions.CreateItem,
		),
		tap(() => {
			this.tableNgxDatatableSmartResource?.reload();
		})
	).subscribe()

	public override ngOnInit() {
		super.ngOnInit();
		this.analyticsService.logEvent('order_service_list_page_initialized');
	}

}
