import {Component, inject} from "@angular/core";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {LANGUAGES} from "@core/shared/enum";
import {NgSelectModule} from "@ng-select/ng-select";
import {DefaultLabelDirective} from "@shared/presentation/directives/label/default.label.directive";
import {
	LanguageBusinessPanelFrontendSettingsAccountApiAdapter
} from "@tenant/account/infrastructure/adapter/external/api/language.business-panel.frontend-settings.account.api.adapter";
import {Reactive} from "@core/cdk/reactive";
import {WINDOW} from "@core/cdk/window.provider";

@Component({
	selector: 'client-settings-language-input-component',
	standalone: true,
	imports: [
		NgSelectModule,
		ReactiveFormsModule,
		TranslateModule,
		DefaultLabelDirective
	],
	providers: [
		LanguageBusinessPanelFrontendSettingsAccountApiAdapter
	],
	template: `
		<label default>
			{{ 'keyword.capitalize.language' | translate }}
		</label>
		<ng-select id="client-settings-form-language"
			bindLabel="name"
			bindValue="code"
			[items]="languages"
			[clearable]="false"
			[formControl]="control" />
	`
})
export class LanguageInputComponent extends Reactive {

	public readonly control = new FormControl();
	public readonly window = inject(WINDOW);
	public readonly translateService = inject(TranslateService);
	public readonly languageBusinessPanelFrontendSettingsAccountApiAdapter = inject(LanguageBusinessPanelFrontendSettingsAccountApiAdapter);
	public readonly languages = LANGUAGES;

	constructor() {
		super();
		this.control.setValue(this.translateService.getCurrentLang());
		this.control.valueChanges.pipe(this.takeUntil()).subscribe((languageCode) => {
			this.translateService.use(languageCode);
			this.languageBusinessPanelFrontendSettingsAccountApiAdapter
				.executeAsync(languageCode)
				.then(() => {
					// TODO: Delete reload when the language change will be fixed
					this.window.location.reload();
				});

		});
	}

}
