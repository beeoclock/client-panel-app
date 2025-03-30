import {Component, HostBinding, input} from "@angular/core";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {LanguageCodeEnum, LANGUAGES} from "@core/shared/enum";
import {DefaultLabelDirective} from "@shared/presentation/directives/label/default.label.directive";
import {NgSelectModule} from "@ng-select/ng-select";
import {TranslateModule} from "@ngx-translate/core";
import {IsRequiredDirective} from "@shared/presentation/directives/is-required/is-required";
import {HasErrorDirective} from "@shared/presentation/directives/has-error/has-error.directive";
import {InvalidTooltipDirective} from "@shared/presentation/directives/invalid-tooltip/invalid-tooltip.directive";

@Component({
	selector: 'client-available-languages-business-settings-component',
	template: `
		<div class="relative">
			<label default for="client-business-settings-form-available-languages">
				{{ 'client.profile.form.section.businessSettings.select.availableLanguages.label' | translate }}
			</label>
			<ng-select
				labelForId="client-business-settings-form-available-languages"
				bindLabel="name"
				bindValue="code"
				isRequired
				hasError
				invalidTooltip
				[multiple]="true"
				[items]="languageList"
				[closeOnSelect]="false"
				[clearable]="false"
				[formControl]="control()">
			</ng-select>
		</div>
		<div class="italic leading-tight p-2 text-beeColor-500 text-sm">
			{{ 'client.profile.form.section.businessSettings.select.availableLanguages.hint' | translate }}
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
export class AvailableLanguagesBusinessSettingsComponent {

	public readonly control = input.required<FormControl<LanguageCodeEnum[]>>();

	public readonly exclude = input<LanguageCodeEnum[]>([]);

	public readonly languageList = LANGUAGES.filter((language) => !this.exclude().includes(language.code))

	@HostBinding()
	public class = 'flex flex-col text-start';

}
