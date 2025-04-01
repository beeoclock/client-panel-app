import {ChangeDetectionStrategy, Component, inject, ViewEncapsulation} from '@angular/core';
import {RouterLink} from "@angular/router";
import {PrimaryButtonDirective} from "@shared/presentation/directives/button/primary.button.directive";
import {BackLinkComponent} from "@shared/presentation/component/link/back.link.component";
import {ChangeLanguageComponent} from "@shared/presentation/component/change-language/change-language.component";
import {CreateBusinessQuery} from "@identity/identity/infrastructure/query/create-business.query";
import {SchedulesFormComponent} from "@shared/presentation/component/schedule/schedules.form.component";
import {TranslateModule} from "@ngx-translate/core";

@Component({
	selector: 'app-schedules-create-business-identity-page',
	templateUrl: './schedules.create-business.identity.page.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		RouterLink,
		PrimaryButtonDirective,
		BackLinkComponent,
		ChangeLanguageComponent,
		SchedulesFormComponent,
		TranslateModule
	],
	encapsulation: ViewEncapsulation.None
})
export class SchedulesCreateBusinessIdentityPage {

	public backPath = 'point-of-sale';
	private readonly createBusinessQuery = inject(CreateBusinessQuery);
	public readonly schedulesForm = this.createBusinessQuery.getSchedulesForm();

}

export default SchedulesCreateBusinessIdentityPage;
