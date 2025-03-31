import {Component, inject, OnDestroy, OnInit, viewChild, ViewEncapsulation} from '@angular/core';
import {BusinessProfileForm} from "@tenant/client/presentation/form/business-profile.form";
import {
	LogoBusinessProfileComponent
} from "@tenant/client/presentation/ui/component/business-profile/logo/logo.business-profile.component";
import {Store} from "@ngxs/store";
import {AppActions} from "@shared/state/app/app.actions";
import {RISchedule} from "@shared/domain/interface/i.schedule";
import {filter} from "rxjs";
import {ServiceProvideTypeEnum} from "@core/shared/enum/service-provide-type.enum";
import {
	FormBusinessProfileComponent
} from "@tenant/client/presentation/ui/component/business-profile/form-business-profile.component";
import {
	BusinessProfileContactPhoneComponent
} from "@tenant/client/presentation/ui/component/business-profile/contact-phone/contact-phone.componen";
import {SchedulesFormComponent} from "@shared/presentation/component/schedule/schedules.form.component";
import {
	AddressBusinessProfileComponent
} from "@tenant/client/presentation/ui/component/business-profile/address/address.business-profile.component";
import {
	SwitchActiveBlockComponent
} from "@shared/presentation/component/switch/switch-active/switch-active-block.component";
import {AsyncPipe} from "@angular/common";
import {
	BusinessProfileSocialMediaComponent
} from "@tenant/client/presentation/ui/component/business-profile/social-media/social-media.componen";
import {PrimaryButtonDirective} from "@shared/presentation/directives/button/primary.button.directive";
import {
	ButtonSaveContainerComponent
} from "@shared/presentation/component/container/button-save/button-save.container.component";
import {TranslateModule} from "@ngx-translate/core";
import {Reactive} from "@core/cdk/reactive";
import {is} from "@core/shared/checker";
import {AnalyticsService} from "@core/cdk/analytics.service";
import {IBusinessProfile} from "@tenant/business-profile/domain/interface/i.business-profile";
import {
	BusinessProfileActions
} from "@tenant/business-profile/infrastructure/state/business-profile/business-profile.actions";
import {
	BusinessProfileState
} from "@tenant/business-profile/infrastructure/state/business-profile/business-profile.state";

@Component({
	selector: 'app-business-profile-client-page',
	templateUrl: './business-profile.page.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		FormBusinessProfileComponent,
		BusinessProfileContactPhoneComponent,
		SchedulesFormComponent,
		AddressBusinessProfileComponent,
		SwitchActiveBlockComponent,
		LogoBusinessProfileComponent,
		AsyncPipe,
		BusinessProfileSocialMediaComponent,
		PrimaryButtonDirective,
		ButtonSaveContainerComponent,
		TranslateModule
	],
	standalone: true
})
export class BusinessProfilePage extends Reactive implements OnInit, OnDestroy {

	// @ViewChild(CoverImageBusinessProfileComponent)
	// public readonly coverImageBusinessProfileComponent!: CoverImageBusinessProfileComponent;

	readonly logoBusinessProfileComponent = viewChild.required(LogoBusinessProfileComponent);

	// @ViewChild(GalleryBusinessProfileComponent)
	// public readonly galleryBusinessProfileComponent!: GalleryBusinessProfileComponent;

	public readonly form = new BusinessProfileForm();
	public readonly store = inject(Store);
	public readonly analyticsService = inject(AnalyticsService);

	public readonly serviceProfideType = ServiceProvideTypeEnum;

	public readonly item$ = this.store.select(BusinessProfileState.item).pipe(
		filter(Boolean)
	);

	public ngOnInit(): void {

		this.analyticsService.logEvent('business_profile_page_initialized');

		this.item$.pipe(this.takeUntil()).subscribe((item) => {

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
			const value = this.form.getRawValue() as unknown as IBusinessProfile.DTO;
			this.checkUsername(value);
			this.form.disable();
			this.form.markAsPending();

			await Promise.all([
				// Save cover image
				// this.coverImageBusinessProfileComponent.save(),
				// Save logo
				this.logoBusinessProfileComponent().save(),
				// Save gallery
				// this.galleryBusinessProfileComponent.save(),
				// Save data
				// this.updateBusinessProfileApiAdapter.executeAsync(value),
				this.store.dispatch(new BusinessProfileActions.Update(value)),
			]);
			this.store.dispatch(new AppActions.PageLoading(false));
			this.form.enable();
			this.form.updateValueAndValidity();
		}
	}

	public override ngOnDestroy() {
		super.ngOnDestroy();
		this.form.destroyHandlers();
	}

	private checkUsername(value: IBusinessProfile.DTO): void {
		if (is.string_empty(value.username)) {
			value.username = null;
		}
	}

}

export default BusinessProfilePage;
