import {Component, inject, input, viewChild} from '@angular/core';
import {FormControl} from "@angular/forms";
import {MediaStateEnum} from "@shared/presentation/ui/component/image/base.image.component";
import {IMedia, RIMedia} from "@tenant/media/domain/interface/i.media";
import {ImageInputTemplate} from "@shared/presentation/ui/component/image/template/image-input.template";
import {
	DeleteImageProductApiAdapter
} from "@tenant/product/product/infrastructure/data-source/api/delete.image.product.api.adapter";
import {
	PatchImageProductApiAdapter
} from "@tenant/product/product/infrastructure/data-source/api/patch.image.product.api.adapter";

@Component({
	selector: 'image-form-product',
	template: `
		<image-input-template [imageList]="control().value"/>
	`,
	standalone: true,
	imports: [
		ImageInputTemplate
	],
	providers: [
		PatchImageProductApiAdapter,
		DeleteImageProductApiAdapter
	]
})
export class ImageFormProduct {

	public readonly control = input.required<FormControl<IMedia[]>>();

	public readonly imageInputTemplate = viewChild(ImageInputTemplate);

	public readonly patchImageProductApiAdapter = inject(PatchImageProductApiAdapter);
	public readonly deleteImageProductApiAdapter = inject(DeleteImageProductApiAdapter);

	public async save(productId: string): Promise<RIMedia[]> {

		const imageList: RIMedia[] = [];

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
				await this.deleteImageProductApiAdapter.executeAsync(productId, image._id);
				continue;
			}

			const formData = new FormData();
			formData.append('file', component.selectedFile as Blob);

			const image = component.image();
			if (image) {
				formData.append('_id', image._id);
			}

			const result = await this.patchImageProductApiAdapter.executeAsync(productId, formData);
			imageList.push(result);

		}

		return imageList;

	}

}
