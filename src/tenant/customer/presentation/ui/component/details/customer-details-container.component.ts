import {Component, inject, input, ViewEncapsulation} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {ActiveStyleDirective} from "@shared/presentation/directives/active-style/active-style.directive";
import {PrimaryLinkStyleDirective} from "@shared/presentation/directives/link/primary.link.style.directive";
import {
	RowActionButtonComponent
} from "@tenant/customer/presentation/ui/component/row-action-button/row-action-button.component";
import ECustomer from "@tenant/customer/domain/entity/e.customer";
import {Router} from "@angular/router";
import {
	StandardDetailsEntityComponent
} from "@shared/presentation/ui/component/entity/standard-details.entity.component";
import {
	OrderSectionCustomerDetailsComponent
} from "@tenant/customer/presentation/ui/component/section/order.section.customer-details.component";

@Component({
	selector: 'customer-details-page',
	templateUrl: './customer-details-container.component.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		TranslateModule,
		ActiveStyleDirective,
		PrimaryLinkStyleDirective,
		RowActionButtonComponent,
		StandardDetailsEntityComponent,
		OrderSectionCustomerDetailsComponent
	],
	host: {
		class: 'bg-neutral-100'
	},
	standalone: true
})
export class CustomerDetailsContainerComponent {

	// TODO add base index of details with store and delete method

	public readonly item = input.required<ECustomer>();

	private readonly router = inject(Router);


	public async openCustomersOrders() {
		const customer = this.item();
		if (customer) {
			await this.router.navigate([{outlets: {second: ['customer', customer._id, 'order']}}], {
				onSameUrlNavigation: 'reload',
			});
		}
	}
}

export default CustomerDetailsContainerComponent;
