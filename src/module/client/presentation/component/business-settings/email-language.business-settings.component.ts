import {Component, Input, OnInit} from "@angular/core";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {LanguageCodeEnum, LANGUAGES} from "@utility/domain/enum";
import {DefaultLabelDirective} from "@utility/presentation/directives/label/default.label.directive";
import {NgSelectModule} from "@ng-select/ng-select";
import {TranslateModule} from "@ngx-translate/core";
import {IsRequiredDirective} from "@utility/presentation/directives/is-required/is-required";
import {HasErrorDirective} from "@utility/presentation/directives/has-error/has-error.directive";
import {InvalidTooltipDirective} from "@utility/presentation/directives/invalid-tooltip/invalid-tooltip.directive";

@Component({
	selector: 'client-email-language-business-settings-component',
	template: `
		<label default for="client-business-settings-form-email-language">
			{{ 'client.profile.form.section.businessSettings.select.emailLanguage.label' | translate }}
		</label>
		<div class="text-sm text-beeColor-500">
			{{ 'client.profile.form.section.businessSettings.select.emailLanguage.hint' | translate }}
		</div>
		<ng-select
			id="client-business-settings-form-email-language"
			bindLabel="name"
			bindValue="code"
			isRequired
			hasError
			invalidTooltip
			[items]="languageList"
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
export class EmailLanguageBusinessSettingsComponent implements OnInit {

	@Input({required: true})
	public control!: FormControl<LanguageCodeEnum>;

	@Input({required: true})
	public availableLanguagesControl!: FormControl<LanguageCodeEnum[]>;

	public languageList = LANGUAGES;

	public ngOnInit() {
		this.updateLanguageList(this.availableLanguagesControl.value);
		this.availableLanguagesControl.valueChanges.subscribe((languageCodeList) => {
			this.updateLanguageList(languageCodeList);

			if (!languageCodeList.includes(this.control.value)) {
				this.control.setValue(languageCodeList[0]);
			}

		});
	}

	public updateLanguageList(languageCodeList: LanguageCodeEnum[]) {
		this.languageList = LANGUAGES.filter((language) => {
			return languageCodeList.includes(language.code);
		});
	}

}
