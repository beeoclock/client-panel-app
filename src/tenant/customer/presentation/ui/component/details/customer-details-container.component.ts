import {Component, inject, input, ViewEncapsulation} from '@angular/core';
import {ICustomer} from '@core/business-logic/customer';
import {Store} from "@ngxs/store";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {TranslateModule} from "@ngx-translate/core";
import {ActiveStyleDirective} from "@utility/presentation/directives/active-style/active-style.directive";
import {
	CustomerOrderListExternalWhacAMole
} from "@tenant/order/presentation/ui/component/external/case/customer/list/customer.order.list.external.whac-a-mole";
import {PrimaryLinkStyleDirective} from "@utility/presentation/directives/link/primary.link.style.directive";
import {
	RowActionButtonComponent
} from "@tenant/customer/presentation/ui/component/row-action-button/row-action-button.component";

@Component({
	selector: 'customer-detail-page',
	templateUrl: './customer-details-container.component.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		DynamicDatePipe,
		TranslateModule,
		ActiveStyleDirective,
		PrimaryLinkStyleDirective,
		RowActionButtonComponent
	],
	standalone: true
})
export class CustomerDetailsContainerComponent {

	// TODO add base index of details with store and delete method

	public readonly item = input.required<ICustomer.EntityRaw>();

	public readonly store = inject(Store);
	public readonly customerOrderListExternalWhacAMole = inject(CustomerOrderListExternalWhacAMole);

	public async openCustomersOrders() {
		await this.customerOrderListExternalWhacAMole.execute(this.item()._id);
	}
}
