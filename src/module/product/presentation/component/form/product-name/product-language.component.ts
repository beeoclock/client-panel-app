import { Component, input, ViewEncapsulation } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormInputComponent } from '@utility/presentation/component/input/form.input.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormTextareaComponent } from '@utility/presentation/component/input/form.textarea.component';
import { LanguageVersionForm } from '@product/domain/model/product.form';

@Component({
	selector: 'product-language-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		ReactiveFormsModule,
		NgSelectModule,
		FormInputComponent,
		TranslateModule,
		FormTextareaComponent,
	],
	template: `
		<form [formGroup]="form()" class="flex flex-col gap-3">
			@if (!hiddenControls().includes('title')) {

                <form-input
                    id="product-form-title"
                    inputType="text"
                    autocomplete="product.title"
                    [placeholder]="'keyword.capitalize.title' | translate"
                    [control]="form().controls.title"
                    [label]="'keyword.capitalize.title' | translate"
                />
                
			} @if (!hiddenControls().includes('description')) {

                <form-textarea-component
                    id="product-form-description"
                    [control]="form().controls.description"
                    [label]="'keyword.capitalize.description' | translate"
                    [placeholder]="
                        'keyword.capitalize.placeholder.description' | translate
                    "
                />
			}
		</form>
	`,
})
export class ProductLanguageComponent {
	public readonly hiddenControls = input<
		('description' | 'title' | 'language')[]
	>([]);

	public readonly form = input.required<LanguageVersionForm>();
}
