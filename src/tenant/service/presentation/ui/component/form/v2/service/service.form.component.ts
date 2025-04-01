import {Component, input, ViewEncapsulation} from '@angular/core';
import {LanguageVersionForm} from '@tenant/service/presentation/form/service.form';
import {ReactiveFormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {
	LanguageServiceFormComponent
} from '@tenant/service/presentation/ui/component/form/v2/service/language.service.form.component';
import {FormInputComponent} from "@shared/presentation/component/input/form.input.component";
import {TranslateModule} from "@ngx-translate/core";
import {FormTextareaComponent} from "@shared/presentation/component/input/form.textarea.component";

@Component({
	selector: 'service-service-form-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		ReactiveFormsModule,
		NgSelectModule,
		LanguageServiceFormComponent,
		FormInputComponent,
		TranslateModule,
		FormTextareaComponent,
	],
	template: `
		<form [formGroup]="form()" class="flex flex-col gap-3">

			@if (!hiddenControls().includes('language')) {

				<service-language-service-form-component
					[control]="form().controls.language"/>
			}

			@if (!hiddenControls().includes('title')) {

				<form-input
					id="service-form-title"
					inputType="text"
					autocomplete="service.title"
					[placeholder]="'keyword.capitalize.title' | translate"
					[control]="form().controls.title"
					[label]="'keyword.capitalize.title' | translate"/>
			}

			@if (!hiddenControls().includes('description')) {

				<form-textarea-component
					id="service-form-description"
					[control]="form().controls.description"
					[label]="'keyword.capitalize.description' | translate"
					[placeholder]="'keyword.capitalize.placeholder.description' | translate"/>
			}

		</form>
	`
})
export class ServiceFormComponent {

	public readonly hiddenControls = input<('description' | 'title' | 'language')[]>([]);

	public readonly form = input.required<LanguageVersionForm>();


}
