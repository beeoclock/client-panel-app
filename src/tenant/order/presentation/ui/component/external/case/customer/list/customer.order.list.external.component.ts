import {ChangeDetectionStrategy, Component, input, OnInit, viewChildren, ViewEncapsulation} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {
	DesktopLayoutListComponent
} from "@tenant/order/presentation/ui/component/list/layout/desktop/desktop.layout.list.component";
import {ListPage} from "@utility/list.page";
import {PeerCustomerOrderState} from "@tenant/order/presentation/state/peer-customer/peer-customer.order.state";
import {
	MobileLayoutListComponent
} from "@tenant/order/presentation/ui/component/list/layout/mobile/mobile.layout.list.component";
import {TableService} from "@utility/table.service";
import {
	CustomerOrderTableService
} from "@tenant/order/presentation/ui/component/external/case/customer/list/customer.order.table.service";
import {TableState} from "@utility/domain/table.state";
import {PeerCustomerOrderActions} from "@tenant/order/presentation/state/peer-customer/peer-customer.order.actions";
import EOrder from "@tenant/order/domain/entity/e.order";

@Component({
	selector: 'order-external-list-component',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		AsyncPipe,
		TranslateModule,
		DesktopLayoutListComponent,
		MobileLayoutListComponent,
	],
	standalone: true,
	providers: [
		{
			provide: TableService,
			useClass: CustomerOrderTableService
		}
	],
	template: `
		@if (initialized.isOn) {

			@if (isMobile$ | async) {

				<app-order-mobile-layout-list-component
					[showButtonGoToForm]="false"
					[isPage]="false"
				/>
			} @else {

				<app-order-desktop-layout-list-component />
			}
		} @else {

			<div class="p-4">
				{{ 'keyword.capitalize.initializing' | translate }}...
			</div>
		}
	`
})
export class CustomerOrderListExternalComponent extends ListPage<EOrder> implements OnInit {

	public readonly customerId = input.required<string>();

	readonly mobileLayoutListComponents = viewChildren(MobileLayoutListComponent);

	public override mobileMode = true;

	public override ngOnInit() {
		this.store.dispatch(new PeerCustomerOrderActions.UpdateFilters({
			customerId: this.customerId(),
		}));
		super.ngOnInit();
		const tableService = this.tableService;
		if (tableService) {
			this.store.select(PeerCustomerOrderState.tableState)
				.pipe(
					this.takeUntil(),
				).subscribe((tableState) => {
				if (tableState.page > tableService.tableState.page) {
					tableService.tableState.addNextPageWithItems(tableState.items);
				} else {
					tableService.tableState = TableState.fromCache(tableState);
				}
				this.changeDetectorRef.detectChanges();
			});
		}
	}

}
