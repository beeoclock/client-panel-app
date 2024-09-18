import {Component, inject, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {BusinessProfileForm} from "@client/presentation/form/business-profile.form";
import {Select, Store} from "@ngxs/store";
import * as Client from "@client/domain";
import {IClient} from "@client/domain";
import {AppActions} from "@utility/state/app/app.actions";
import {RISchedule} from "@utility/domain/interface/i.schedule";
import {ClientState} from "@client/state/client/client.state";
import {filter, Observable} from "rxjs";
import {
	UpdateBusinessProfileApiAdapter
} from "@client/adapter/external/api/buisness-profile/update.business-profile.api.adapter";
import {ClientActions} from "@client/state/client/client.actions";
import {
	BookingSettingsBusinessProfileComponent
} from "@client/presentation/component/business-profile/booking-settings/booking-settings.business-profile.component";
import {
	ButtonSaveContainerComponent
} from "@utility/presentation/component/container/button-save/button-save.container.component";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {BackButtonComponent} from "@utility/presentation/component/button/back.button.component";
import {DefaultPanelComponent} from "@utility/presentation/component/panel/default.panel.component";
import {EventSettingsComponent} from "@client/presentation/component/settings/event/event.settings.component";
import {TranslateModule} from "@ngx-translate/core";
import {ServiceSettingsComponent} from "@client/presentation/component/settings/service/service.settings.component";
import {DangerZoneComponent} from "@client/presentation/component/danger-zone/danger-zone.component";
import {
	ContainerBusinessSettingsComponent
} from "@client/presentation/component/business-settings/container.business-settings.component";
import {
	AutoBookEventComponent
} from "@client/presentation/component/business-settings/auto-book-event/auto-book-event.component";
import {Reactive} from "@utility/cdk/reactive";
import {AnalyticsService} from "@utility/cdk/analytics.service";
import {NGXLogger} from "ngx-logger";
import {
	NotificationSettingsComponent
} from "@client/presentation/component/business-profile/notification-settings/notification-settings.component";

@Component({
	selector: 'client-business-settings-page',
	templateUrl: './business-settings.page.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		BookingSettingsBusinessProfileComponent,
		ButtonSaveContainerComponent,
		PrimaryButtonDirective,
		BackButtonComponent,
		DefaultPanelComponent,
		EventSettingsComponent,
		TranslateModule,
		ServiceSettingsComponent,
		DangerZoneComponent,
		ContainerBusinessSettingsComponent,
		AutoBookEventComponent,
		NotificationSettingsComponent,
	],
	standalone: true
})
export default class BusinessSettingsPage extends Reactive implements OnInit, OnDestroy {

	public readonly form = new BusinessProfileForm();
	public readonly ngxLogger = inject(NGXLogger);
	public readonly store = inject(Store);
	public readonly analyticsService = inject(AnalyticsService);
	public readonly updateBusinessProfileApiAdapter = inject(UpdateBusinessProfileApiAdapter);

	@Select(ClientState.item)
	public readonly item$!: Observable<Client.RIClient>;

	public ngOnInit(): void {

		this.analyticsService.logEvent('business_settings_page_initialized');

		this.item$.pipe(
			filter(Boolean),
			this.takeUntil(),
		).subscribe((item) => {

			const {socialNetworkLinks, schedules, contacts, addresses, ...data} = item;
			this.form.patchValue(data);

			this.form.controls.businessCategory.disable();
			this.form.controls.businessIndustry.disable();
			this.form.controls.serviceProvideType.disable();

			if (socialNetworkLinks?.length) {
				this.form.controls.socialNetworkLinks.clear();
				socialNetworkLinks.forEach((socialNetworkLink) => {
					this.form.controls.socialNetworkLinks.pushNewOne(socialNetworkLink);
				});
			}

			if (schedules?.length) {
				this.form.controls.schedules.clear();
				schedules.forEach((schedule) => {
					this.form.controls.schedules.pushNewOne(schedule as RISchedule);
				});
			}

			if (contacts?.length) {
				this.form.controls.contacts.clear();
				contacts.forEach((contact) => {
					this.form.controls.contacts.pushNewOne(contact);
				});
			}

			if (addresses?.length) {
				this.form.controls.addresses.clear();
				addresses.forEach((address) => {
					this.form.controls.addresses.pushNewOne(address, {
						initValidation: false,
					});
				});
			} else {
				this.form.controls.addresses.pushNewOne(undefined, {
					initValidation: false,
				});
			}

		});

	}

	// Save data
	public async save(): Promise<void> {
		this.form.markAllAsTouched();
		if (this.form.valid) {
			this.store.dispatch(new AppActions.PageLoading(true));
			const value = this.form.getRawValue() as unknown as IClient;
			this.form.disable();
			this.form.markAsPending();

			await Promise.all([
				// Save data
				this.updateBusinessProfileApiAdapter.executeAsync(value),
			]);

			this.store.dispatch(new AppActions.PageLoading(false));
			this.store.dispatch(new ClientActions.InitClient());
			this.form.enable();
			this.form.updateValueAndValidity();
		} else {
			this.ngxLogger.error('Form is invalid', this.form);
		}
	}

	public override ngOnDestroy(): void {
		super.ngOnDestroy();
		this.form.destroyHandlers();
	}

}
