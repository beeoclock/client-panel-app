import {Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {DangerZoneComponent} from '@module/client/presentation/component/danger-zone/danger-zone.component';
import {ChangePasswordComponent} from '@module/client/presentation/component/change-password/change-password.component';
import {DeleteButtonComponent} from "@utility/presentation/component/button/delete.button.component";
import {ReactiveFormsModule} from "@angular/forms";
import {LanguageInputComponent} from "@module/client/presentation/component/settings/language-input.component";
import {TranslateModule} from "@ngx-translate/core";
import {AccountSettingsComponent} from "@client/presentation/component/settings/account/account.settings.component";
import {GeneralSettingsComponent} from "@client/presentation/component/settings/general/general.settings.component";
import {EventSettingsComponent} from "@client/presentation/component/settings/event/event.settings.component";
import {SignOutSettingsComponent} from "@client/presentation/component/settings/sign-out/sign-out.settings.component";
import {ServiceSettingsComponent} from "@client/presentation/component/settings/service/service.settings.component";
import {
	NotificationSettingsComponent
} from "@client/presentation/component/settings/notification/notification.settings.component";
import {AnalyticsService} from "@utility/cdk/analytics.service";

@Component({
	selector: 'client-settings-page',
	templateUrl: './settings.page.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		DangerZoneComponent,
		ChangePasswordComponent,
		DeleteButtonComponent,
		ReactiveFormsModule,
		LanguageInputComponent,
		TranslateModule,
		AccountSettingsComponent,
		GeneralSettingsComponent,
		EventSettingsComponent,
		SignOutSettingsComponent,
		ServiceSettingsComponent,
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
