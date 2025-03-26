import {Component, input} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {FormTextareaComponent} from "@utility/presentation/component/input/form.textarea.component";
import {LanguageVersionForm} from "@[tenant]/service/presentation/form/service.form";
import {CardComponent} from "@utility/presentation/component/card/card.component";

@Component({
	selector: 'service-form-details-block-component',
	standalone: true,
	template: `
		<bee-card>
			@if (showHeader()) {

				<span class="text-2xl font-bold text-beeColor-500">{{ 'keyword.capitalize.details' | translate }}</span>
			}

			<form-input
				id="service-form-details-title-input"
				inputType="text"
				autocomplete="service.title"
				[placeholder]="'keyword.capitalize.title' | translate"
				[control]="form().controls.title"
				[label]="'keyword.capitalize.title' | translate"/>

			<form-textarea-component
				id="service-form-details-description-input"
				[control]="form().controls.description"
				[label]="'keyword.capitalize.description' | translate"
				[placeholder]="'keyword.capitalize.placeholder.description' | translate"/>

		</bee-card>
	`,
	imports: [
		TranslateModule,
		FormInputComponent,
		FormTextareaComponent,
		CardComponent,
	]
})
export class DetailsBlockComponent {

	public readonly form = input(new LanguageVersionForm());

	public readonly showHeader = input(false);

}
