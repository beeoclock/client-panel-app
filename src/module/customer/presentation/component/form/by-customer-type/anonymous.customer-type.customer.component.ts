import {Component, Input, ViewEncapsulation} from '@angular/core';
import {CustomerForm} from "@customer/presentation/form";

@Component({
	selector: 'app-anonymous-customer-type-customer',
	encapsulation: ViewEncapsulation.None,
	imports: [],
	standalone: true,
	template: `

	`
})
export class AnonymousCustomerTypeCustomerComponent {

	@Input()
	public form!: CustomerForm;

}
