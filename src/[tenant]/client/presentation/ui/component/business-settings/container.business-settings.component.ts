import {Component, Input} from "@angular/core";
import {
	EmailLanguageBusinessSettingsComponent
} from "@[tenant]/client/presentation/ui/component/business-settings/email-language.business-settings.component";
import {BusinessSettingsForm} from "@[tenant]/client/presentation/form/business-settings.form";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {
	TimeZoneBookingSettingsComponent
} from "@[tenant]/client/presentation/ui/component/business-settings/time-zone/time-zone.booking-settings.component";
import {
	BaseCurrencyBusinessSettingsComponent
} from "@[tenant]/client/presentation/ui/component/business-settings/base-currency.business-settings.component";
import {TranslateModule} from "@ngx-translate/core";
import {
	BaseLanguageBusinessSettingsComponent
} from "@[tenant]/client/presentation/ui/component/business-settings/base-language.business-settings.component";
import {
	AvailableLanguagesBusinessSettingsComponent
} from "@[tenant]/client/presentation/ui/component/business-settings/available-languages.business-settings.component";

@Component({
	selector: 'client-container-business-settings-component',
	template: `
		@if (businessSettings) {

			<bee-card>

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
		}
	`,
	imports: [
		AvailableLanguagesBusinessSettingsComponent,
		EmailLanguageBusinessSettingsComponent,
		CardComponent,
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
