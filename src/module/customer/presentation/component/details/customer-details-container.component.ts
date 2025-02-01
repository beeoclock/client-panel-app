import {Component, inject, input, ViewEncapsulation} from '@angular/core';
import {Store} from "@ngxs/store";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {TranslateModule} from "@ngx-translate/core";
import {ActiveStyleDirective} from "@utility/presentation/directives/active-style/active-style.directive";
import {
	CustomerOrderListExternalWhacAMole
} from "@order/presentation/component/external/case/customer/list/customer.order.list.external.whac-a-mole";
import {PrimaryLinkStyleDirective} from "@utility/presentation/directives/link/primary.link.style.directive";
import {RowActionButtonComponent} from "@customer/presentation/component/row-action-button/row-action-button.component";
import {ICustomer} from "@core/interface/i.customer";

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

	public readonly item = input.required<ICustomer.Entity>();

	// public readonly customerStore = inject(ECustomer.store);
	public readonly store = inject(Store);
	public readonly customerOrderListExternalWhacAMole = inject(CustomerOrderListExternalWhacAMole);
	public customer: undefined | ICustomer.Entity = undefined;

	public constructor() {

		// effect(() => {
		// 	// const cursor = Customers.find({firstName: 'Mark'});
		// 	// console.log(cursor.count())
		//
		// 	// this.customer = this.customerStore.getItem(this.item()._id);
		//
		// 	// const item = this.customerStore.getItem(this.item()._id);
		// 	this.customer = ECustomer.database.findOne({
		// 		id: this.item()._id,
		// 	});
		// 	console.log('effect:', this.customer);
		//
		// })
	}

	public async openCustomersOrders() {
		await this.customerOrderListExternalWhacAMole.execute(this.item()._id);
	}
}
