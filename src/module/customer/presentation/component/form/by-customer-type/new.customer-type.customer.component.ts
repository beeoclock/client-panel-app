import {Component, HostBinding, Input, ViewEncapsulation} from '@angular/core';
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
		<app-event-form-attendant-component [form]="form"/>
	`
})
export class NewCustomerTypeCustomerComponent {

	@Input()
	public form!: CustomerForm;

	@HostBinding()
	public readonly class = 'flex flex-col gap-2'

}
