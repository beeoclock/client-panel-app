import {ChangeDetectionStrategy, Component, input, OnInit, viewChildren, ViewEncapsulation} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {
	DesktopLayoutListComponent
} from "@order/presentation/component/list/layout/desktop/desktop.layout.list.component";
import {ListPage} from "@utility/list.page";
import {PeerCustomerOrderState} from "@order/infrastructure/state/peer-customer/peer-customer.order.state";
import {MobileLayoutListComponent} from "@order/presentation/component/list/layout/mobile/mobile.layout.list.component";
import {TableService} from "@utility/table.service";
import {
	CustomerOrderTableService
} from "@order/presentation/component/external/case/customer/list/customer.order.table.service";
import {TableState} from "@utility/domain/table.state";
import {PeerCustomerOrderActions} from "@order/infrastructure/state/peer-customer/peer-customer.order.actions";
import EOrder from "@core/business-logic/order/entity/e.order";

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
					[tableState]="tableService.tableState"
				/>
			} @else {

				<app-order-desktop-layout-list-component
					[tableState]="tableService.tableState"/>
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
		this.store.select(PeerCustomerOrderState.tableState)
			.pipe(
				this.takeUntil(),
			).subscribe((tableState) => {
			if (tableState.page > this.tableService.tableState.page) {
				this.tableService.tableState.addNextPageWithItems(tableState.items);
			} else {
				this.tableService.tableState = TableState.fromCache(tableState);
			}
			this.changeDetectorRef.detectChanges();
		});
	}

}
