import {Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {
	AccountSettingsComponent
} from "@tenant/client/presentation/ui/component/settings/account/account.settings.component";
import {
	GeneralSettingsComponent
} from "@tenant/client/presentation/ui/component/settings/general/general.settings.component";
import {
	SignOutSettingsComponent
} from "@tenant/client/presentation/ui/component/settings/sign-out/sign-out.settings.component";
import {
	NotificationSettingsComponent
} from "@tenant/client/presentation/ui/component/settings/notification/notification.settings.component";
import {AnalyticsService} from "@core/cdk/analytics.service";

@Component({
	selector: 'client-settings-page',
	templateUrl: './settings.page.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		ReactiveFormsModule,
		TranslateModule,
		AccountSettingsComponent,
		GeneralSettingsComponent,
		SignOutSettingsComponent,
		NotificationSettingsComponent
	],
	standalone: true
})
export class SettingsPage implements OnInit {

	private readonly analyticsService = inject(AnalyticsService);

	public ngOnInit(): void {

		this.analyticsService.logEvent('notification_page_initialized');

	}


}

export default SettingsPage;
