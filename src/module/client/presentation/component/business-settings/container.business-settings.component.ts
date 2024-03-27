import {Component, Input} from "@angular/core";
import {
	AvailableLanguagesBusinessSettingsComponent
} from "@client/presentation/component/business-settings/available-languages.business-settings.component";
import {
	EmailLanguageBusinessSettingsComponent
} from "@client/presentation/component/business-settings/email-language.business-settings.component";
import {BusinessSettingsForm} from "@client/presentation/form/business-settings.form";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {NgIf} from "@angular/common";
import {
	CurrenciesBusinessSettingsComponent
} from "@client/presentation/component/business-settings/currencies.business-settings.component";

@Component({
	selector: 'client-container-business-settings-component',
	template: `
		<bee-card *ngIf="businessSettings">
			<client-available-languages-business-settings-component
				[control]="businessSettings.controls.availableLanguages"/>
			<client-email-language-business-settings-component
				[availableLanguagesControl]="businessSettings.controls.availableLanguages"
				[control]="businessSettings.controls.emailLanguage"/>
			<client-currencies-business-settings-component
				[control]="businessSettings.controls.currencies"/>
		</bee-card>
	`,
	imports: [
		AvailableLanguagesBusinessSettingsComponent,
		EmailLanguageBusinessSettingsComponent,
		CardComponent,
		NgIf,
		CurrenciesBusinessSettingsComponent
	],
	standalone: true
})
export class ContainerBusinessSettingsComponent {

	@Input({ required: true })
	public businessSettings!: BusinessSettingsForm;

}
