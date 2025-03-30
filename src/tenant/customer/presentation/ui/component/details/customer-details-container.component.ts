import {Component, inject, signal, ViewEncapsulation} from '@angular/core';
import {ICustomer} from '@tenant/customer/domain';
import {Store} from "@ngxs/store";
import {DynamicDatePipe} from "@shared/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {TranslateModule} from "@ngx-translate/core";
import {ActiveStyleDirective} from "@shared/presentation/directives/active-style/active-style.directive";
import {
	CustomerOrderListExternalWhacAMole
} from "@tenant/order/presentation/component/external/case/customer/list/customer.order.list.external.whac-a-mole";
import {PrimaryLinkStyleDirective} from "@shared/presentation/directives/link/primary.link.style.directive";
import {RowActionButtonComponent} from "@tenant/customer/presentation/component/row-action-button/row-action-button.component";
import {ActivatedRoute} from "@angular/router";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {map, tap} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

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

	public readonly customer = signal<ICustomer.EntityRaw | null>(null);

	public readonly activatedRoute = inject(ActivatedRoute);
	public readonly sharedUow = inject(SharedUow);
	public readonly store = inject(Store);
	public readonly customerOrderListExternalWhacAMole = inject(CustomerOrderListExternalWhacAMole);
	public readonly customerIdSubscription = this.activatedRoute.params.pipe(
		takeUntilDestroyed(),
		map((params) => params.id),
		tap((customerId) => {
			console.log({customerId})
			this.sharedUow.customer.repository.findByIdAsync(customerId).then((customer) => {
				this.customer.set(customer ?? null);
			});
		})
	).subscribe();

	public async openCustomersOrders() {
		const customer = this.customer();
		if (customer) {
			await this.customerOrderListExternalWhacAMole.execute(customer._id);
		}
	}
}

export default CustomerDetailsContainerComponent;
