import {Component, input, ViewEncapsulation} from '@angular/core';

import {ReactiveFormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {TranslateModule} from '@ngx-translate/core';
import {FormInputComponent} from "@shared/presentation/ui/component/input/form.input.component";
import {ProductTagForm} from "@tenant/product/product-tag/presentation/form/product-tag.form";

@Component({
	selector: 'product-tag-name-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		ReactiveFormsModule,
		NgSelectModule,
		FormInputComponent,
		TranslateModule,
	],
	template: `
		<form-input
			id="product-form-name-field"
			inputType="text"
			autocomplete="product-tag-name"
			[placeholder]="'keyword.capitalize.title' | translate"
			[control]="form().controls.name"
			[label]="'keyword.capitalize.title' | translate"
		/>
	`,
})
export class ProductTagNameComponent {
	public readonly form = input.required<ProductTagForm>();
}
