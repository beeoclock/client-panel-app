import {Component, HostBinding, input, ViewEncapsulation} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {
	NamesFormAttendantComponent
} from "@event/presentation/component/form/attendees/attendant/names.form.attendant.component";
import {CustomerForm} from "@customer/presentation/form";

@Component({
	selector: 'app-unregistered-customer-type-customer',
	encapsulation: ViewEncapsulation.None,
	imports: [
		NamesFormAttendantComponent,
		TranslateModule
	],
	standalone: true,
	template: `

		<app-event-names-form-attendant-component [form]="form()"/>

	`
})
export class UnregisteredCustomerTypeCustomerComponent {

	public readonly form = input.required<CustomerForm>();

	@HostBinding()
	public readonly class = 'flex flex-col gap-2'

}
