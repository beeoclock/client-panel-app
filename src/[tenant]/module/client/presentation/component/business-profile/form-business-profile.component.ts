import {Component, Input, ViewEncapsulation} from '@angular/core';
import {BusinessProfileForm} from '@client/presentation/form/business-profile.form';
import {ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from "@ngx-translate/core";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {BusinessCategoryComponent} from "@utility/presentation/component/input/business-category.component";
import {BusinessIndustryComponent} from "@utility/presentation/component/input/business-industry.component";
import {ServiceProvideTypeComponent} from "@utility/presentation/component/input/service-provide-type.component";
import {
	FormInputWithLeftHintComponent
} from "@utility/presentation/component/input/form.input-with-left-hint.component";

@Component({
	selector: 'client-business-profile-form-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		ReactiveFormsModule,
		TranslateModule,
		CardComponent,
		FormInputComponent,
		BusinessCategoryComponent,
		BusinessIndustryComponent,
		ServiceProvideTypeComponent,
		FormInputWithLeftHintComponent
	],
	template: `
		<bee-card>

			<strong class="dark:text-white">{{ 'client.profile.title' | translate }}</strong>

			<form-input
				id="business-profile-form-name-input"
				inputType="text"
				autocomplete="name"
				[placeholder]="'client.profile.form.inputs.name.placeholder' | translate"
				[control]="form.controls.name"
				[label]="'client.profile.form.inputs.name.label' | translate"/>

			<div>
				<form-input-with-left-hint
					id="business-profile-form-username-input"
					leftHint="https://beeoclock.com/"
					[control]="form.controls.username"
					[placeholder]="'client.profile.form.inputs.username.placeholder' | translate"
					[label]="'client.profile.form.inputs.username.label' | translate"/>
				<p
					class="italic leading-tight p-2 text-beeColor-500 text-sm">{{ 'client.profile.form.inputs.username.hint.under' | translate }}</p>
			</div>

<!--			<form-textarea-component-->
<!--				id="business-profile-form-description-input"-->
<!--				[label]="'client.profile.form.inputs.description.label' | translate"-->
<!--				[placeholder]="'client.profile.form.inputs.description.placeholder' | translate"-->
<!--				[control]="form.controls.description"/>-->

			<bee-business-category-select-component
				id="business-profile-form-businessCategory-input"
				[control]="form.controls.businessCategory"/>

			@if (form.controls.businessIndustry.value)  {

				<bee-business-industry-select-component
					id="business-profile-form-businessIndustry-input"
					[control]="form.controls.businessIndustry"/>
			}

			@if (form.controls.serviceProvideType.value) {

				<bee-service-provide-type-select-component
					id="business-profile-form-serviceProvideType-input"
					[control]="form.controls.serviceProvideType"/>
			}

			<form-input
				id="business-profile-form-name-input"
				inputType="color"
				autocomplete="primaryColor"
				[control]="form.controls.publicPageSettings.controls.primaryColor"
				[label]="'client.profile.form.inputs.primaryColor.label' | translate"/>

		</bee-card>
	`
})
export class FormBusinessProfileComponent {

	@Input({ required: true })
	public form!: BusinessProfileForm;

}
