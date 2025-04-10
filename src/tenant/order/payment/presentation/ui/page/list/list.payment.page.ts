import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ListPage} from "@shared/list.page";
import {TranslateModule} from "@ngx-translate/core";
import {
	PaymentTableNgxDatatableResource
} from "@tenant/order/payment/presentation/ui/page/list/payment.table-ngx-datatable.resource";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ofActionSuccessful} from "@ngxs/store";
import {tap} from "rxjs";
import {PaymentDataActions} from "@tenant/order/payment/infrastructure/state/data/payment.data.actions";
import {DatePipe} from "@angular/common";
import {
	DesktopLayoutListComponent
} from "@tenant/order/payment/presentation/ui/organism/list/layout/desktop/desktop.layout.list.component";
import {
	TableNgxDatatableSmartResource
} from "@shared/presentation/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";

@Component({
	selector: 'app-list-payment-page',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		TranslateModule,
		DesktopLayoutListComponent,
	],
	standalone: true,
	template: `

		<payment-desktop-layout-list-component/>

	`,
	providers: [
		DatePipe,
		{
			provide: TableNgxDatatableSmartResource,
			useClass: PaymentTableNgxDatatableResource,
		},
	],
})
export default class ListPaymentPage extends ListPage implements OnInit {

	public readonly actionsSubscription = this.actions.pipe(
		takeUntilDestroyed(),
		ofActionSuccessful(
			PaymentDataActions.Update,
			PaymentDataActions.CreateItem,
		),
		tap((payload) => {
			this.tableNgxDatatableSmartResource?.refreshDiscoveredPages();
		})
	).subscribe();

	public override ngOnInit() {
		super.ngOnInit();
		this.analyticsService.logEvent('payment_list_page_initialized');
	}

}
