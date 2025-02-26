import {Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {AccountSettingsComponent} from "@client/presentation/component/settings/account/account.settings.component";
import {GeneralSettingsComponent} from "@client/presentation/component/settings/general/general.settings.component";
import {SignOutSettingsComponent} from "@client/presentation/component/settings/sign-out/sign-out.settings.component";
import {
	NotificationSettingsComponent
} from "@client/presentation/component/settings/notification/notification.settings.component";
import {AnalyticsService} from "@utility/cdk/analytics.service";

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
