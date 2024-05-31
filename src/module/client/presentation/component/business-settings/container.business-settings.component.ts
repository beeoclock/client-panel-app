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
import {
	MandatoryAttendeePropertiesComponent
} from "@client/presentation/component/booking-settings/mandatory-attendee-properties/mandatory-attendee-properties.component";
import {
	TimeZoneBookingSettingsComponent
} from "@client/presentation/component/business-settings/time-zone/time-zone.booking-settings.component";
import {
	BaseCurrencyBusinessSettingsComponent
} from "@client/presentation/component/business-settings/base-currency.business-settings.component";

@Component({
	selector: 'client-container-business-settings-component',
	template: `
		<bee-card *ngIf="businessSettings">
			<client-available-languages-business-settings-component
				[control]="businessSettings.controls.availableLanguages"/>
			<client-email-language-business-settings-component
				[availableLanguagesControl]="businessSettings.controls.availableLanguages"
				[control]="businessSettings.controls.emailLanguage"/>
			<app-client-base-currency-business-settings-component
				[control]="businessSettings.controls.baseCurrency"/>
<!--			<client-currencies-business-settings-component-->
<!--				[control]="businessSettings.controls.currencies"/>-->
			<client-booking-settings-time-zone-component
				[control]="businessSettings.controls.timeZone"/>
		</bee-card>
	`,
	imports: [
		AvailableLanguagesBusinessSettingsComponent,
		EmailLanguageBusinessSettingsComponent,
		CardComponent,
		NgIf,
		CurrenciesBusinessSettingsComponent,
		MandatoryAttendeePropertiesComponent,
		TimeZoneBookingSettingsComponent,
		BaseCurrencyBusinessSettingsComponent
	],
	standalone: true
})
export class ContainerBusinessSettingsComponent {

	@Input({ required: true })
	public businessSettings!: BusinessSettingsForm;

}
