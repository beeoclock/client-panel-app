import {Component, HostBinding, input, ViewEncapsulation} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {FormAttendantComponent} from "@event/presentation/component/form/attendees/attendant/form.attendant.component";
import {CustomerForm} from "@customer/presentation/form";

@Component({
	selector: 'app-new-customer-type-customer',
	encapsulation: ViewEncapsulation.None,
	imports: [
		TranslateModule,
		FormAttendantComponent
	],
	standalone: true,
	template: `
		<app-event-form-attendant-component [form]="form()"/>
	`
})
export class NewCustomerTypeCustomerComponent {

	public readonly form = input.required<CustomerForm>();

	@HostBinding()
	public readonly class = 'flex flex-col gap-2 pb-4'

}
