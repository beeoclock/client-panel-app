import {ChangeDetectionStrategy, Component, inject, ViewEncapsulation} from '@angular/core';
import {RouterLink} from "@angular/router";
import {PrimaryLinkButtonDirective} from "@utility/presentation/directives/button/primary.link.button.directive";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {BackLinkComponent} from "@utility/presentation/component/link/back.link.component";
import {ChangeLanguageComponent} from "@utility/presentation/component/change-language/change-language.component";
import {CreateBusinessQuery} from "@identity/query/create-business.query";
import {
	AddressBusinessProfileComponent
} from "@client/presentation/component/business-profile/address/address.business-profile.component";
import {TranslateModule} from "@ngx-translate/core";
import {
	ContainerBusinessSettingsComponent
} from "@client/presentation/component/business-settings/container.business-settings.component";

@Component({
	selector: 'app-languages-create-business-identity-ui-page',
	templateUrl: './languages.create-business.identity.ui.page.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
    imports: [
        RouterLink,
        PrimaryLinkButtonDirective,
        FormInputComponent,
        PrimaryButtonDirective,
        BackLinkComponent,
        ChangeLanguageComponent,
        AddressBusinessProfileComponent,
        TranslateModule,
        ContainerBusinessSettingsComponent
    ],
	encapsulation: ViewEncapsulation.None
})
export class LanguagesCreateBusinessIdentityUiPage {

	private readonly createBusinessQuery = inject(CreateBusinessQuery);
	public readonly businessSettingsForm = this.createBusinessQuery.getBusinessSettings();

	public backPath = 'schedules';

}

export default LanguagesCreateBusinessIdentityUiPage;
