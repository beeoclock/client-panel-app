import {Component, input, ViewEncapsulation} from '@angular/core';
import {CustomerForm} from "@tenant/customer/presentation/form";

@Component({
	selector: 'app-anonymous-customer-type-customer',
	encapsulation: ViewEncapsulation.None,
	imports: [],
	standalone: true,
	template: `

	`
})
export class AnonymousCustomerTypeCustomerComponent {

	public readonly form = input.required<CustomerForm>();

}
