import {Component, inject, Input, ViewChild} from '@angular/core';
import {NgIf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {FormControl} from "@angular/forms";
import {PatchBannerServiceApiAdapter} from "@service/adapter/external/api/patch.banner.service.api.adapter";
import {SrcByMediaIdService} from "@module/media/presentation/directive/src-by-media-id/src-by-media-id.service";
import {BooleanState} from "@utility/domain";
import {
	ServiceFormImageComponent
} from "@service/presentation/component/form/v2/image/service-form-image/service-form-image.component";

@Component({
	selector: 'service-form-image-block-component',
	standalone: true,
	templateUrl: `image-block.component.html`,
	imports: [
		NgIf,
		TranslateModule,
		CardComponent,
		ServiceFormImageComponent
	]
})
export class ImageBlockComponent {

	@Input()
	public serviceId: string | undefined;

	@Input()
	public mediaId: string | undefined;

	@ViewChild(ServiceFormImageComponent)
	public serviceFormImageComponent!: ServiceFormImageComponent;

	public readonly toggleInfo = new BooleanState(true);

	public readonly control = new FormControl();

	public readonly srcByMediaIdService = inject(SrcByMediaIdService);
	public readonly patchBannerServiceApiAdapter = inject(PatchBannerServiceApiAdapter);

	public async save(serviceId?: string | undefined): Promise<void> {

		if (this.serviceFormImageComponent.mediaIsChanged.isOff) {
			return;
		}

		const body: {
			media: string;
			_id?: string;
		} = {
			media: this.control.value,
		};

		if (this.mediaId) {
			body._id = this.mediaId;
		}

		const {_id, media} = await this.patchBannerServiceApiAdapter.executeAsync(serviceId ?? this.serviceId, body);
		await this.srcByMediaIdService.set(_id, media);

	}

}
