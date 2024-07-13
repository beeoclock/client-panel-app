import {Component, HostBinding, Input, OnInit} from "@angular/core";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {LanguageCodeEnum, LANGUAGES} from "@utility/domain/enum";
import {DefaultLabelDirective} from "@utility/presentation/directives/label/default.label.directive";
import {NgSelectModule} from "@ng-select/ng-select";
import {TranslateModule} from "@ngx-translate/core";
import {IsRequiredDirective} from "@utility/presentation/directives/is-required/is-required";
import {HasErrorDirective} from "@utility/presentation/directives/has-error/has-error.directive";
import {InvalidTooltipDirective} from "@utility/presentation/directives/invalid-tooltip/invalid-tooltip.directive";
import {Reactive} from "@utility/cdk/reactive";

@Component({
	selector: 'client-email-language-business-settings-component',
	template: `
		<div class="relative">
			<label default for="client-business-settings-form-email-language">
				{{ 'client.profile.form.section.businessSettings.select.emailLanguage.label' | translate }}
			</label>
			<ng-select
				labelForId="client-business-settings-form-email-language"
				bindLabel="name"
				bindValue="code"
				isRequired
				hasError
				invalidTooltip
				[items]="languageList"
				[clearable]="false"
				[formControl]="control">
			</ng-select>
		</div>
		<div class="italic leading-tight p-2 text-beeColor-500 text-sm">
			{{ 'client.profile.form.section.businessSettings.select.emailLanguage.hint' | translate }}
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
export class EmailLanguageBusinessSettingsComponent extends Reactive implements OnInit {

	@Input({required: true})
	public control!: FormControl<LanguageCodeEnum>;

	@Input({required: true})
	public availableLanguagesControl!: FormControl<LanguageCodeEnum[]>;

	public languageList = LANGUAGES;

	@HostBinding()
	public class = 'flex flex-col text-start';

	public ngOnInit() {
		this.updateLanguageList(this.availableLanguagesControl.value);
		this.availableLanguagesControl.valueChanges.pipe(this.takeUntil()).subscribe((languageCodeList) => {
			this.updateLanguageList(languageCodeList);

		});
	}

	public updateLanguageList(languageCodeList: LanguageCodeEnum[]) {
		this.languageList = LANGUAGES.filter((language) => {
			return languageCodeList.includes(language.code);
		});
		if (!languageCodeList.includes(this.control.value)) {
			this.control.setValue(languageCodeList[0]);
		}
	}

}
