import {Component, inject, Input} from '@angular/core';
import {NgIf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {ServiceFormImageComponent} from "@service/presentation/component/form/v2/image/service-form-image.component";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {FormControl} from "@angular/forms";
import {PatchBannerServiceApiAdapter} from "@service/adapter/external/api/patch.banner.service.api.adapter";

@Component({
  selector: 'service-form-image-block-component',
  standalone: true,
  template: `
    <card>
      <span class="text-2xl font-bold text-beeColor-500">{{ 'keyword.capitalize.image' | translate }}</span>
      <service-form-image-component [control]="control" [mediaId]="mediaId"></service-form-image-component>
      <p class="text-beeColor-500">
        {{ 'service.form.v2.section.presentation.motivate' | translate }}
      </p>
    </card>
  `,
  imports: [
    NgIf,
    TranslateModule,
    ServiceFormImageComponent,
    CardComponent
  ]
})
export class ImageBlockComponent {

  @Input()
  public serviceId: string | undefined;

  @Input()
  public mediaId: string | undefined;

  public readonly control = new FormControl();

  public readonly patchBannerServiceApiAdapter = inject(PatchBannerServiceApiAdapter);

  public async save(serviceId?: string | undefined): Promise<void> {

    const body: {
      media: string;
      _id?: string;
    } = {
      media: this.control.value,
    };

    if (this.mediaId) {
      body._id = this.mediaId;
    }

    await this.patchBannerServiceApiAdapter.executeAsync(serviceId ?? this.serviceId, body);

  }

}
