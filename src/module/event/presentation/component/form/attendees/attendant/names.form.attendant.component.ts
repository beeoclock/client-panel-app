import {Component, HostBinding, input, ViewEncapsulation} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {TranslateModule} from "@ngx-translate/core";
import {CustomerForm} from "@customer/presentation/form";

@Component({
	selector: 'app-event-names-form-attendant-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		ReactiveFormsModule,
		FormInputComponent,
		TranslateModule,
	],
	template: `

		<form-input
			inputType="text"
			autocomplete="off"
			id="attendee-first-name"
			[placeholder]="'keyword.capitalize.firstName' | translate"
			[control]="form().controls.firstName"
			[label]="'keyword.capitalize.firstName' | translate"/>

		<form-input
			inputType="text"
			autocomplete="off"
			id="attendee-last-name"
			[placeholder]="'keyword.capitalize.lastName' | translate"
			[control]="form().controls.lastName"
			[label]="'keyword.capitalize.lastName' | translate"/>


	`
})
export class NamesFormAttendantComponent {

	public readonly form = input.required<CustomerForm>();

	@HostBinding()
	public readonly class = 'flex gap-3';


}
