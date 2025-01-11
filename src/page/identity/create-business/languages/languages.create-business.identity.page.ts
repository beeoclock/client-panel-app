import {ChangeDetectionStrategy, Component, inject, ViewEncapsulation} from '@angular/core';
import {RouterLink} from "@angular/router";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {BackLinkComponent} from "@utility/presentation/component/link/back.link.component";
import {ChangeLanguageComponent} from "@utility/presentation/component/change-language/change-language.component";
import {CreateBusinessQuery} from "@identity/query/create-business.query";
import {TranslateModule} from "@ngx-translate/core";
import {
	ContainerBusinessSettingsComponent
} from "@client/presentation/component/business-settings/container.business-settings.component";

@Component({
	selector: 'app-languages-create-business-identity-page',
	templateUrl: './languages.create-business.identity.page.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		RouterLink,
		PrimaryButtonDirective,
		BackLinkComponent,
		ChangeLanguageComponent,
		TranslateModule,
		ContainerBusinessSettingsComponent
	],
	encapsulation: ViewEncapsulation.None
})
export class LanguagesCreateBusinessIdentityPage {

	public backPath = 'schedules';
	private readonly createBusinessQuery = inject(CreateBusinessQuery);
	public readonly businessSettingsForm = this.createBusinessQuery.getBusinessSettings();

}

export default LanguagesCreateBusinessIdentityPage;
