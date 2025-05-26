import {Component, inject, input, viewChild} from '@angular/core';
import {FormControl} from "@angular/forms";
import {
	PatchBannerServiceApiAdapter
} from "@tenant/service/infrastructure/data-source/api/patch.banner.service.api.adapter";
import {ServicePresentationForm} from '@tenant/service/presentation/form/service.presentation.form';
import {
	DeleteBannerServiceApiAdapter
} from "@tenant/service/infrastructure/data-source/api/delete.banner.service.api.adapter";
import {MediaStateEnum} from "@shared/presentation/component/image/base.image.component";
import {IMedia} from "@tenant/media/domain/interface/i.media";
import {ImageInputTemplate} from "@shared/presentation/component/image/template/image-input.template";

@Component({
	selector: 'service-form-image-block-component',
	template: `
		<image-input-template [imageList]="presentationForm().value.banners ?? []"/>
	`,
	standalone: true,
	imports: [
		ImageInputTemplate
	]
})
export class ImageBlockComponent {

	public readonly presentationForm = input.required<ServicePresentationForm>();
	public readonly imageInputTemplate = viewChild(ImageInputTemplate);

	public readonly control = new FormControl();

	public readonly patchBannerServiceApiAdapter = inject(PatchBannerServiceApiAdapter);
	public readonly deleteBannerServiceApiAdapter = inject(DeleteBannerServiceApiAdapter);

	public async save(serviceId: string): Promise<IMedia[]> {

		const imageList: IMedia[] = [];

		const imageInputTemplate = this.imageInputTemplate();

		if (!imageInputTemplate) {
			return imageList;
		}

		for (const component of imageInputTemplate.imageInput()) {

			if (component.mediaState === MediaStateEnum.NOT_CHANGED) {
				continue;
			}

			if (component.mediaState === MediaStateEnum.DELETED) {
				const image = component.image();
				if (!image) {
					continue;
				}
				await this.deleteBannerServiceApiAdapter.executeAsync(serviceId, image._id);
				continue;
			}

			const formData = new FormData();
			formData.append('file', component.selectedFile as Blob);

			const image = component.image();
			if (image) {
				formData.append('_id', image._id);
			}

			const result = await this.patchBannerServiceApiAdapter.executeAsync(serviceId, formData);
			imageList.push(result);

		}

		return imageList;

	}

}
