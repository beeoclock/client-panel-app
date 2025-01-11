import {Component, input, ViewEncapsulation} from '@angular/core';
import {LanguageVersionForm} from '@service/presentation/form/service.form';
import {ReactiveFormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {HasErrorDirective} from '@utility/presentation/directives/has-error/has-error.directive';
import {IsRequiredDirective} from '@utility/presentation/directives/is-required/is-required';
import {
	LanguageServiceFormComponent
} from '@service/presentation/component/form/v2/service/language.service.form.component';
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {TranslateModule} from "@ngx-translate/core";
import {NgIf} from "@angular/common";
import {FormTextareaComponent} from "@utility/presentation/component/input/form.textarea.component";

@Component({
	selector: 'service-service-form-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		ReactiveFormsModule,
		HasErrorDirective,
		NgSelectModule,
		IsRequiredDirective,
		LanguageServiceFormComponent,
		FormInputComponent,
		TranslateModule,
		NgIf,
		FormTextareaComponent,
	],
	template: `
		<form [formGroup]="form()" class="flex flex-col gap-3">

			<service-language-service-form-component
				*ngIf="!hiddenControls().includes('language')"
				[control]="form().controls.language"/>


			<form-input
				*ngIf="!hiddenControls().includes('title')"
				id="service-form-title"
				inputType="text"
				autocomplete="service.title"
				[placeholder]="'keyword.capitalize.title' | translate"
				[control]="form().controls.title"
				[label]="'keyword.capitalize.title' | translate"/>

			<form-textarea-component
				*ngIf="!hiddenControls().includes('description')"
				id="service-form-description"
				[control]="form().controls.description"
				[label]="'keyword.capitalize.description' | translate"
				[placeholder]="'keyword.capitalize.placeholder.description' | translate"/>

		</form>
	`
})
export class ServiceFormComponent {

	public readonly hiddenControls = input<('description' | 'title' | 'language')[]>([]);

	public readonly form = input.required<LanguageVersionForm>();


}
