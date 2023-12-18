import {Component, inject, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {BusinessProfileForm} from "@client/presentation/form/business-profile.form";
import {
	CoverImageBusinessProfileComponent
} from "@client/presentation/component/business-profile/cover-image/cover-image.business-profile.component";
import {
	LogoBusinessProfileComponent
} from "@client/presentation/component/business-profile/logo/logo.business-profile.component";
import {Select, Store} from "@ngxs/store";
import * as Client from "@client/domain";
import {IClient} from "@client/domain";
import {AppActions} from "@utility/state/app/app.actions";
import {RISchedule} from "@utility/domain/interface/i.schedule";
import {
	GalleryBusinessProfileComponent
} from "@client/presentation/component/business-profile/gallery/gallery.business-profile/gallery.business-profile.component";
import {ClientState} from "@client/state/client/client.state";
import {filter, Observable} from "rxjs";
import {
	UpdateBusinessProfileApiAdapter
} from "@client/adapter/external/api/buisness-profile/update.business-profile.api.adapter";
import {ServiceProvideTypeEnum} from "@utility/domain/enum/service-provide-type.enum";
import {ClientActions} from "@client/state/client/client.actions";
import {
	FormBusinessProfileComponent
} from "@client/presentation/component/business-profile/form-business-profile.component";
import {BackButtonComponent} from "@utility/presentation/component/button/back.button.component";
import {DefaultPanelComponent} from "@utility/presentation/component/panel/default.panel.component";
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
import {AsyncPipe, NgIf} from "@angular/common";
import {
	FacilitiesBusinessProfileComponent
} from "@client/presentation/component/business-profile/facilities/facilities.business-profile.component";
import {
	BusinessProfileSocialMediaComponent
} from "@client/presentation/component/business-profile/social-media/social-media.componen";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {
	ButtonSaveContainerComponent
} from "@utility/presentation/component/container/button-save/button-save.container.component";
import {TranslateModule} from "@ngx-translate/core";

@Component({
	selector: 'client-business-profile-page',
	templateUrl: './index.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		FormBusinessProfileComponent,
		BackButtonComponent,
		DefaultPanelComponent,
		BusinessProfileContactPhoneComponent,
		GalleryBusinessProfileComponent,
		CoverImageBusinessProfileComponent,
		SchedulesFormComponent,
		AddressBusinessProfileComponent,
		SwitchActiveBlockComponent,
		LogoBusinessProfileComponent,
		AsyncPipe,
		FacilitiesBusinessProfileComponent,
		BusinessProfileSocialMediaComponent,
		NgIf,
		PrimaryButtonDirective,
		ButtonSaveContainerComponent,
		TranslateModule
	],
	standalone: true
})
export default class Index implements OnInit {

	@ViewChild(CoverImageBusinessProfileComponent)
	public readonly coverImageBusinessProfileComponent!: CoverImageBusinessProfileComponent;

	@ViewChild(LogoBusinessProfileComponent)
	public readonly logoBusinessProfileComponent!: LogoBusinessProfileComponent;

	@ViewChild(GalleryBusinessProfileComponent)
	public readonly galleryBusinessProfileComponent!: GalleryBusinessProfileComponent;

	public readonly form = new BusinessProfileForm();
	public readonly store = inject(Store);
	public readonly updateBusinessProfileApiAdapter = inject(UpdateBusinessProfileApiAdapter);

	public readonly serviceProfideType = ServiceProvideTypeEnum;

	@Select(ClientState.item)
	public readonly item$!: Observable<Client.RIClient>;

	public ngOnInit(): void {

		this.item$.pipe(
			filter(Boolean)
		).subscribe((item) => {

			const {socialNetworkLinks, schedules, contacts, ...data} = item;
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
				// Save cover image
				this.coverImageBusinessProfileComponent.save(),
				// Save logo
				this.logoBusinessProfileComponent.save(),
				// Save gallery
				this.galleryBusinessProfileComponent.save(),
				// Save data
				this.updateBusinessProfileApiAdapter.executeAsync(value),
			]);

			this.store.dispatch(new AppActions.PageLoading(false));
			this.store.dispatch(new ClientActions.InitClient());
			this.form.enable();
			this.form.updateValueAndValidity();
		}
	}

}
