import {Component, inject, OnDestroy, OnInit, viewChild, ViewEncapsulation} from '@angular/core';
import {BusinessProfileForm} from "@client/presentation/form/business-profile.form";
import {
	LogoBusinessProfileComponent
} from "@client/presentation/component/business-profile/logo/logo.business-profile.component";
import {Store} from "@ngxs/store";
import {AppActions} from "@utility/state/app/app.actions";
import {RISchedule} from "@utility/domain/interface/i.schedule";
import {ClientState} from "@client/state/client/client.state";
import {filter} from "rxjs";
import {ServiceProvideTypeEnum} from "@utility/domain/enum/service-provide-type.enum";
import {ClientActions} from "@client/state/client/client.actions";
import {
	FormBusinessProfileComponent
} from "@client/presentation/component/business-profile/form-business-profile.component";
import {
	BusinessProfileContactPhoneComponent
} from "@client/presentation/component/business-profile/contact-phone/contact-phone.componen";
import {SchedulesFormComponent} from "@utility/presentation/component/schedule/schedules.form.component";
import {
	AddressBusinessProfileComponent
} from "@client/presentation/component/business-profile/address/address.business-profile.component";
import {
	SwitchActiveBlockComponent
} from "@utility/presentation/component/switch/switch-active/switch-active-block.component";
import {AsyncPipe} from "@angular/common";
import {
	BusinessProfileSocialMediaComponent
} from "@client/presentation/component/business-profile/social-media/social-media.componen";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {
	ButtonSaveContainerComponent
} from "@utility/presentation/component/container/button-save/button-save.container.component";
import {TranslateModule} from "@ngx-translate/core";
import {Reactive} from "@utility/cdk/reactive";
import {is} from "@utility/checker";
import {AnalyticsService} from "@utility/cdk/analytics.service";
import {IBusinessProfile} from "@client/domain/interface/i.business-profile";

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

	public readonly item$ = this.store.select(ClientState.item).pipe(
		filter(Boolean)
	);

	public ngOnInit(): void {

		this.analyticsService.logEvent('business_profile_page_initialized');

		this.store.dispatch(new ClientActions.InitClient());

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
				this.store.dispatch(new ClientActions.UpdateClient(value)),
			]);

			this.store.dispatch(new AppActions.PageLoading(false));
			this.store.dispatch(new ClientActions.InitClient());
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
