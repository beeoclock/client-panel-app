import {Component, Input, ViewEncapsulation} from '@angular/core';
import {CustomerForm} from "@customer/presentation/form";

@Component({
	selector: 'app-unknown-customer-type-customer',
	encapsulation: ViewEncapsulation.None,
	imports: [],
	standalone: true,
	template: `

	`
})
export class UnknownCustomerTypeCustomerComponent {

	@Input()
	public form!: CustomerForm;

}
