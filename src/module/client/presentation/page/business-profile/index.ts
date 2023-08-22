import {Component, inject, ViewEncapsulation} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {BusinessProfileForm} from "@client/form/business-profile.form";
import {TranslateModule} from "@ngx-translate/core";
import {
  CoverImageBusinessProfileComponent
} from "@client/presentation/component/business-profile/cover-image/cover-image.business-profile.component";
import {
  FormBusinessProfileComponent
} from "@client/presentation/component/business-profile/form-business-profile.component";
import {
  LogoBusinessProfileComponent
} from "@client/presentation/component/business-profile/logo/logo.business-profile.component";
import {Store} from "@ngxs/store";
import * as Client from "@client/domain";
import {IClient} from "@client/domain";
import {UpdateClientApiAdapter} from "@client/adapter/external/api/update.client.api.adapter";
import {SwitchActiveBlockComponent} from "@utility/presentation/component/switch-active/switch-active-block.component";
import {NgForOf} from "@angular/common";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {
  AddressBusinessProfileComponent
} from "@client/presentation/component/business-profile/address/address.business-profile.component";
import {
  GalleryBusinessProfileComponent
} from "@client/presentation/component/business-profile/gallery/gallery.business-profile.component";
import {SchedulesFormComponent} from "@utility/presentation/component/schedule/schedules.form.component";
import {
  BusinessProfileContactPhoneComponent
} from "@client/presentation/component/business-profile/contact-phone/contact-phone.componen";
import {
  BusinessProfileSocialMediaComponent
} from "@client/presentation/component/business-profile/social-media/social-media.componen";
import {
  FacilitiesBusinessProfileComponent
} from "@client/presentation/component/business-profile/facilities/facilities.business-profile.component";
import {
  BookingSettingsBusinessProfileComponent
} from "@client/presentation/component/business-profile/booking-settings/booking-settings.business-profile.component";
import {AppActions} from "@utility/state/app/app.actions";

@Component({
  selector: 'client-settings-page',
  templateUrl: 'index.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    FormBusinessProfileComponent,
    ReactiveFormsModule,
    TranslateModule,
    CoverImageBusinessProfileComponent,
    LogoBusinessProfileComponent,
    SwitchActiveBlockComponent,
    NgForOf,
    CardComponent,
    AddressBusinessProfileComponent,
    GalleryBusinessProfileComponent,
    SchedulesFormComponent,
    BusinessProfileContactPhoneComponent,
    BusinessProfileSocialMediaComponent,
    FacilitiesBusinessProfileComponent,
    BookingSettingsBusinessProfileComponent
  ],
  standalone: true
})
export default class Index {

  public readonly form = new BusinessProfileForm();
  public readonly store = inject(Store);
  public readonly updateClientApiAdapter = inject(UpdateClientApiAdapter);

  constructor() {
    // Init data
    const item: Client.IClient = this.store.snapshot().client.item;

    const {socialNetworkLinks, schedules, contacts, ...data} = item;
    this.form.patchValue(data);

    if (socialNetworkLinks?.length) {
      socialNetworkLinks.forEach((socialNetworkLink) => {
        this.form.controls.socialNetworkLinks.pushNewOne(socialNetworkLink);
      });
    }

    if (schedules?.length) {
      schedules.forEach((schedule) => {
        this.form.controls.schedules.pushNewOne(schedule);
      });
    }

    if (contacts?.length) {
      contacts.forEach((contact) => {
        this.form.controls.contacts.pushNewOne(contact);
      });
    }

  }

  // Save data
  public async save(): Promise<void> {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.store.dispatch(new AppActions.PageLoading(true));
      const value = this.form.getRawValue() as IClient;
      this.form.disable();
      await this.updateClientApiAdapter.executeAsync(value);
      this.store.dispatch(new AppActions.PageLoading(false));
      this.form.enable();
    }
  }

}
