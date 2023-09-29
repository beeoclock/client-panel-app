import {Component, Input, ViewEncapsulation} from '@angular/core';
import {DeleteButtonComponent} from '@utility/presentation/component/button/delete.button.component';
import {BusinessProfileForm} from '@client/presentation/form/business-profile.form';
import {ReactiveFormsModule} from '@angular/forms';
import {SpinnerComponent} from '@utility/presentation/component/spinner/spinner.component';
import {NgForOf, NgIf} from '@angular/common';
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";
import {TranslateModule} from "@ngx-translate/core";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {FormTextareaComponent} from "@utility/presentation/component/input/form.textarea.component";
import {BusinessCategoryComponent} from "@utility/presentation/component/input/business-category.component";
import {BusinessIndustryComponent} from "@utility/presentation/component/input/business-industry.component";
import {ServiceProvideTypeComponent} from "@utility/presentation/component/input/service-provide-type.component";

@Component({
	selector: 'client-business-profile-form-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		DeleteButtonComponent,
		ReactiveFormsModule,
		SpinnerComponent,
		NgIf,
		LoaderComponent,
		NgForOf,
		TranslateModule,
		CardComponent,
		FormInputComponent,
		FormTextareaComponent,
		BusinessCategoryComponent,
		BusinessIndustryComponent,
		ServiceProvideTypeComponent
	],
	template: `
		<bee-card>

			<strong class="dark:text-white">{{ 'client.profile.title' | translate }}</strong>

			<form-input
				id="business-profile-form-name-input"
				type="text"
				autocomplete="name"
				[placeholder]="'client.profile.form.inputs.name.placeholder' | translate"
				[control]="form.controls.name"
				[label]="'client.profile.form.inputs.name.label' | translate"/>

			<form-textarea-component
				id="business-profile-form-description-input"
				[label]="'client.profile.form.inputs.description.label' | translate"
				[placeholder]="'client.profile.form.inputs.description.placeholder' | translate"
				[control]="form.controls.description"/>

			<bee-business-category-select-component
				id="business-profile-form-businessCategory-input"
				[control]="form.controls.businessCategory"/>

			<bee-business-industry-select-component
				*ngIf="form.controls.businessIndustry.value"
				id="business-profile-form-businessIndustry-input"
				[control]="form.controls.businessIndustry"/>

			<bee-service-provide-type-select-component
				*ngIf="form.controls.serviceProvideType.value"
				id="business-profile-form-serviceProvideType-input"
				[control]="form.controls.serviceProvideType"/>

		</bee-card>
	`
})
export class FormBusinessProfileComponent {

	@Input()
	public form = new BusinessProfileForm();

}
