import {Component, Input, ViewEncapsulation} from '@angular/core';
import {FormControl} from "@angular/forms";
import {AbsenceTypeEnum} from "@absence/domain/enums/absence.type.enum";
import {ActiveEnum} from "@utility/domain/enum";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {DatetimeLocalInputComponent} from "@utility/presentation/component/input/datetime-local.input.component";
import {TranslateModule} from "@ngx-translate/core";
import {FormTextareaComponent} from "@utility/presentation/component/input/form.textarea.component";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {
	FormBusinessProfileComponent
} from "@client/presentation/component/business-profile/form-business-profile.component";
import {SwitchComponent} from "@utility/presentation/component/switch/switch.component";

@Component({
	selector: 'app-absence-form-container',
	encapsulation: ViewEncapsulation.None,
	imports: [
		FormInputComponent,
		DatetimeLocalInputComponent,
		TranslateModule,
		FormTextareaComponent,
		CardComponent,
		FormBusinessProfileComponent,
		SwitchComponent
	],
	standalone: true,
	template: `

		<bee-card>
			<datetime-local-input-component
				[label]="'keyword.capitalize.ownOptionOfTime' | translate"
				[control]="start"/>

			<datetime-local-input-component
				[label]="'keyword.capitalize.ownOptionOfTime' | translate"
				[control]="end"/>

			<form-textarea-component
				id="event-form-public-note-input"
				[label]="'keyword.capitalize.note' | translate"
				[placeholder]="'event.form.section.additional.input.note.placeholder' | translate"
				[control]="note"/>

			<utility-switch-component
				[control]="entireBusiness"
				[label]="'client.profile.form.inputs.published.label' | translate"/>

			[TODO type]
			[TODO memberIds]
		</bee-card>

	`
})
export class AbsenceFormContainerComponent {

	@Input()
	public start!: FormControl<string>;

	@Input()
	public end!: FormControl<string>;

	@Input()
	public timeZone!: FormControl<string>;

	@Input()
	public note!: FormControl<string>;

	@Input()
	public active!: FormControl<ActiveEnum>;

	@Input()
	public type!: FormControl<AbsenceTypeEnum>;

	@Input()
	public entireBusiness!: FormControl<boolean>;

	@Input()
	public memberIds!: FormControl<string[]>;


}
