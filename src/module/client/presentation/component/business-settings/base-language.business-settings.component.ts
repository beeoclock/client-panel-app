import {Component, HostBinding, input} from "@angular/core";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {LanguageCodeEnum, LANGUAGES} from "src/core/shared/enum";
import {DefaultLabelDirective} from "@utility/presentation/directives/label/default.label.directive";
import {NgSelectModule} from "@ng-select/ng-select";
import {TranslateModule} from "@ngx-translate/core";
import {IsRequiredDirective} from "@utility/presentation/directives/is-required/is-required";
import {HasErrorDirective} from "@utility/presentation/directives/has-error/has-error.directive";
import {InvalidTooltipDirective} from "@utility/presentation/directives/invalid-tooltip/invalid-tooltip.directive";

@Component({
	selector: 'client-base-language-business-settings-component',
	template: `
		<div class="relative">
			<label default for="client-business-settings-form-base-language">
				{{ 'client.profile.form.section.businessSettings.select.baseLanguage.label' | translate }}
			</label>
			<ng-select
				labelForId="client-business-settings-form-base-language"
				bindLabel="name"
				bindValue="code"
				isRequired
				hasError
				invalidTooltip
				[placeholder]="'client.profile.form.section.businessSettings.select.baseLanguage.placeholder' | translate"
				[multiple]="false"
				[items]="languageList"
				[closeOnSelect]="false"
				[clearable]="false"
				[formControl]="control()">
			</ng-select>
		</div>
		<div class="italic leading-tight p-2 text-beeColor-500 text-sm">
			{{ 'client.profile.form.section.businessSettings.select.baseLanguage.hint' | translate }}
		</div>
	`,
	imports: [
		DefaultLabelDirective,
		NgSelectModule,
		TranslateModule,
		ReactiveFormsModule,
		IsRequiredDirective,
		HasErrorDirective,
		InvalidTooltipDirective
	],
	standalone: true
})
export class BaseLanguageBusinessSettingsComponent {

	public readonly control = input.required<FormControl<LanguageCodeEnum>>();

	public readonly include = input<LanguageCodeEnum[] | null>(null);

	public readonly languageList = this.include() ?? LANGUAGES;

	@HostBinding()
	public class = 'flex flex-col text-start';

}
