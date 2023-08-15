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
import {
  SocialNetworkLinkFormComponent
} from "@client/presentation/component/settings/social-network-link.form.component";
import {NgForOf} from "@angular/common";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {
  AddressBusinessProfileComponent
} from "@client/presentation/component/business-profile/address/address.business-profile.component";
import {
  GalleryBusinessProfileComponent
} from "@client/presentation/component/business-profile/gallery/gallery.business-profile.component";
import {SchedulesFormComponent} from "@utility/presentation/component/schedule/schedules.form.component";

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
        SocialNetworkLinkFormComponent,
        NgForOf,
        CardComponent,
        AddressBusinessProfileComponent,
        GalleryBusinessProfileComponent,
        SchedulesFormComponent
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

    const {socialNetworkLinks, schedules, ...data} = item;
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

  }

  // Save data
  public async save(): Promise<void> {
    this.form.markAllAsTouched();
    console.log(this.form);
    if (this.form.valid) {
      await this.updateClientApiAdapter.executeAsync(this.form.getRawValue() as IClient);
    }
  }

}
