import {Component, HostBinding, Input} from "@angular/core";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {LanguageCodeEnum, LANGUAGES} from "@utility/domain/enum";
import {DefaultLabelDirective} from "@utility/presentation/directives/label/default.label.directive";
import {NgSelectModule} from "@ng-select/ng-select";
import {TranslateModule} from "@ngx-translate/core";
import {IsRequiredDirective} from "@utility/presentation/directives/is-required/is-required";
import {HasErrorDirective} from "@utility/presentation/directives/has-error/has-error.directive";
import {InvalidTooltipDirective} from "@utility/presentation/directives/invalid-tooltip/invalid-tooltip.directive";

@Component({
	selector: 'client-available-languages-business-settings-component',
	template: `
		<label default for="client-business-settings-form-available-languages">
			{{ 'client.profile.form.section.businessSettings.select.availableLanguages.label' | translate }}
		</label>
		<div class="text-sm text-beeColor-500">
			{{ 'client.profile.form.section.businessSettings.select.availableLanguages.hint' | translate }}
		</div>
		<ng-select
			id="client-business-settings-form-available-languages"
			bindLabel="name"
			bindValue="code"
			isRequired
			hasError
			invalidTooltip
			[multiple]="true"
			[items]="languageList"
			[closeOnSelect]="false"
			[clearable]="false"
			[formControl]="control">
		</ng-select>
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

	@Input({ required: true })
	public control!: FormControl<LanguageCodeEnum[]>;

	public readonly languageList = LANGUAGES;

	@HostBinding()
	public class = 'flex flex-col text-start';

}
