import {Component, inject, input, ViewEncapsulation} from '@angular/core';
import {DynamicDatePipe} from "@shared/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {TranslateModule} from "@ngx-translate/core";
import {ActiveStyleDirective} from "@shared/presentation/directives/active-style/active-style.directive";
import {
	CustomerOrderListExternalWhacAMole
} from "@tenant/order/presentation/ui/component/external/case/customer/list/customer.order.list.external.whac-a-mole";
import {PrimaryLinkStyleDirective} from "@shared/presentation/directives/link/primary.link.style.directive";
import {
	RowActionButtonComponent
} from "@tenant/customer/presentation/ui/component/row-action-button/row-action-button.component";
import ECustomer from "@tenant/customer/domain/entity/e.customer";

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

	public readonly item = input.required<ECustomer>();

	public readonly customerOrderListExternalWhacAMole = inject(CustomerOrderListExternalWhacAMole);

	public async openCustomersOrders() {
		const customer = this.item();
		if (customer) {
			await this.customerOrderListExternalWhacAMole.execute(customer._id);
		}
	}
}

export default CustomerDetailsContainerComponent;
