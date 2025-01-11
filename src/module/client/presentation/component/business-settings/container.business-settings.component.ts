import {Component, Input} from "@angular/core";
import {
	EmailLanguageBusinessSettingsComponent
} from "@client/presentation/component/business-settings/email-language.business-settings.component";
import {BusinessSettingsForm} from "@client/presentation/form/business-settings.form";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {NgIf} from "@angular/common";
import {
	TimeZoneBookingSettingsComponent
} from "@client/presentation/component/business-settings/time-zone/time-zone.booking-settings.component";
import {
	BaseCurrencyBusinessSettingsComponent
} from "@client/presentation/component/business-settings/base-currency.business-settings.component";
import {TranslateModule} from "@ngx-translate/core";
import {
	BaseLanguageBusinessSettingsComponent
} from "@client/presentation/component/business-settings/base-language.business-settings.component";
import {
	AvailableLanguagesBusinessSettingsComponent
} from "@client/presentation/component/business-settings/available-languages.business-settings.component";

@Component({
	selector: 'client-container-business-settings-component',
	template: `
		<bee-card *ngIf="businessSettings">

			<strong class="dark:text-white">
				{{ 'keyword.capitalize.languageAndRegion' | translate }}
			</strong>
			<client-available-languages-business-settings-component
				[control]="businessSettings.controls.availableLanguages"/>
			<client-base-language-business-settings-component
				[include]="businessSettings.controls.availableLanguages.value"
				[control]="businessSettings.controls.baseLanguage"/>
			<client-email-language-business-settings-component
				[availableLanguagesControl]="businessSettings.controls.availableLanguages"
				[control]="businessSettings.controls.emailLanguage"/>
			<client-booking-settings-time-zone-component
				[control]="businessSettings.controls.timeZone"/>
			<app-client-base-currency-business-settings-component
				[control]="businessSettings.controls.baseCurrency"/>
			<!--			<client-currencies-business-settings-component-->
			<!--				[control]="businessSettings.controls.currencies"/>-->
		</bee-card>
	`,
	imports: [
		AvailableLanguagesBusinessSettingsComponent,
		EmailLanguageBusinessSettingsComponent,
		CardComponent,
		NgIf,
		TimeZoneBookingSettingsComponent,
		BaseCurrencyBusinessSettingsComponent,
		TranslateModule,
		BaseLanguageBusinessSettingsComponent
	],
	standalone: true
})
export class ContainerBusinessSettingsComponent {

	@Input({required: true})
	public businessSettings!: BusinessSettingsForm;

}
