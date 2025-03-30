import {Component, input} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {TranslateModule} from "@ngx-translate/core";
import {CustomerForm} from "@tenant/customer/presentation/form";
import {InvalidTooltipComponent} from "@utility/presentation/component/invalid-message/invalid-message";
import {
	NamesFormAttendantComponent
} from "@tenant/event/presentation/ui/component/form/attendees/attendant/names.form.attendant.component";
import {TelFormInputComponent} from "@utility/presentation/component/tel-form-input/tel.form.input.component";

@Component({
	selector: 'app-event-form-attendant-component',
	standalone: true,
	imports: [
		ReactiveFormsModule,
		FormInputComponent,
		TranslateModule,
		InvalidTooltipComponent,
		NamesFormAttendantComponent,
		TelFormInputComponent
	],
	template: `

		<div class="grid gap-3">

			<app-event-names-form-attendant-component [form]="form()"/>

			<form-input
				inputType="email"
				autocomplete="off"
				placeholder="firstname.lastname@example.com"
				id="attendee-email"
				[control]="form().controls.email"
				[label]="'keyword.capitalize.email' | translate"/>

			<tel-form-input
				id="attendee-phone"
				[control]="form().controls.phone"
				[label]="'keyword.capitalize.phone' | translate"
				autocomplete="off"/>

			<div
				[class.hidden]="
					form().valid ||
					form().controls.phone.untouched ||
					form().controls.email.untouched
				">
				<utility-invalid-message class="flex justify-center" [control]="form()"/>
			</div>

		</div>
	`
})
export class FormAttendantComponent {

	public readonly form = input.required<CustomerForm>();


}
