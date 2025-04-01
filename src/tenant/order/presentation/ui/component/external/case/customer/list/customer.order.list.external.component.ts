import {ChangeDetectionStrategy, Component, input, OnInit, viewChildren, ViewEncapsulation} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {
	DesktopLayoutListComponent
} from "@tenant/order/presentation/ui/component/list/layout/desktop/desktop.layout.list.component";
import {ListPage} from "@shared/list.page";
import {
	MobileLayoutListComponent
} from "@tenant/order/presentation/ui/component/list/layout/mobile/mobile.layout.list.component";
import {PeerCustomerOrderActions} from "@tenant/order/presentation/state/peer-customer/peer-customer.order.actions";

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
	template: `
		@if (initialized.isOn) {

			@if (isMobile$ | async) {

				<app-order-mobile-layout-list-component
					[showButtonGoToForm]="false"
					[isPage]="false"
				/>
			} @else {

				<app-order-desktop-layout-list-component/>
			}
		} @else {

			<div class="p-4">
				{{ 'keyword.capitalize.initializing' | translate }}...
			</div>
		}
	`
})
export class CustomerOrderListExternalComponent extends ListPage implements OnInit {

	public readonly customerId = input.required<string>();

	readonly mobileLayoutListComponents = viewChildren(MobileLayoutListComponent);

	public override mobileMode = input<boolean>(true);

	public override ngOnInit() {
		this.store.dispatch(new PeerCustomerOrderActions.UpdateFilters({
			customerId: this.customerId(),
		}));
		super.ngOnInit();
	}

}
