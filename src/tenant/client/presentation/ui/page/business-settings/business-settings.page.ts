import {Component, inject, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {BusinessProfileForm} from "@tenant/client/presentation/form/business-profile.form";
import {Select, Store} from "@ngxs/store";
import {AppActions} from "@utility/state/app/app.actions";
import {RISchedule} from "@utility/domain/interface/i.schedule";
import {filter, firstValueFrom, Observable} from "rxjs";
import {
	BookingSettingsBusinessProfileComponent
} from "@tenant/client/presentation/ui/component/business-profile/booking-settings/booking-settings.business-profile.component";
import {
	ButtonSaveContainerComponent
} from "@utility/presentation/component/container/button-save/button-save.container.component";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {TranslateModule} from "@ngx-translate/core";
import {DangerZoneComponent} from "@tenant/client/presentation/ui/component/danger-zone/danger-zone.component";
import {
	ContainerBusinessSettingsComponent
} from "@tenant/client/presentation/ui/component/business-settings/container.business-settings.component";
import {Reactive} from "@utility/cdk/reactive";
import {AnalyticsService} from "@utility/cdk/analytics.service";
import {NGXLogger} from "ngx-logger";
import {
	NotificationSettingsComponent
} from "@tenant/client/presentation/ui/component/business-profile/notification-settings/notification-settings.component";
import EBusinessProfile from "@tenant/business-profile/domain/entity/e.business-profile";
import {
	BusinessProfileState
} from "@tenant/business-profile/infrastructure/state/business-profile/business-profile.state";
import {
	BusinessProfileActions
} from "@tenant/business-profile/infrastructure/state/business-profile/business-profile.actions";
import {Dispatch} from '@ngxs-labs/dispatch-decorator';
import {IBusinessProfile} from "@tenant/business-profile/domain/interface/i.business-profile";

@Component({
	selector: 'client-business-settings-page',
	templateUrl: './business-settings.page.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		BookingSettingsBusinessProfileComponent,
		ButtonSaveContainerComponent,
		PrimaryButtonDirective,
		TranslateModule,
		DangerZoneComponent,
		ContainerBusinessSettingsComponent,
		NotificationSettingsComponent,
	],
	standalone: true
})
export default class BusinessSettingsPage extends Reactive implements OnInit, OnDestroy {

	public readonly form = new BusinessProfileForm();
	public readonly ngxLogger = inject(NGXLogger);
	public readonly store = inject(Store);
	public readonly analyticsService = inject(AnalyticsService);

	@Select(BusinessProfileState.item)
	public readonly item$!: Observable<EBusinessProfile>;

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

	@Dispatch()
	private saveBusinessProfile(value: IBusinessProfile.DTO) {
		return new BusinessProfileActions.Update(value);
	}

	// Save data
	public async save(): Promise<void> {
		this.form.markAllAsTouched();
		if (this.form.valid) {
			this.store.dispatch(new AppActions.PageLoading(true));
			const value = this.form.getRawValue() as unknown as IBusinessProfile.DTO;
			this.form.disable();
			this.form.markAsPending();

			try {
				await Promise.all([
					// Save data
					firstValueFrom(this.saveBusinessProfile(value) as unknown as Observable<unknown>),
				]);
			} catch (e) {
				this.ngxLogger.error(e);
			}

			this.store.dispatch(new AppActions.PageLoading(false));
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
