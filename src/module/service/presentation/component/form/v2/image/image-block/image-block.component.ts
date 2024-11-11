import {Component, inject, Input, QueryList, ViewChildren} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {FormControl} from "@angular/forms";
import {PatchBannerServiceApiAdapter} from "@service/adapter/external/api/patch.banner.service.api.adapter";
import {BooleanState} from "@utility/domain";
import {
	ServiceFormImageComponent
} from "@service/presentation/component/form/v2/image/service-form-image/service-form-image.component";
import {ServicePresentationForm} from '@src/module/service/presentation/form/service.presentation.form';
import {DeleteBannerServiceApiAdapter} from "@service/adapter/external/api/delete.banner.service.api.adapter";
import {MediaStateEnum} from "@utility/presentation/component/image/base.image.component";

@Component({
	selector: 'service-form-image-block-component',
	templateUrl: './image-block.component.html',
	standalone: true,
	imports: [
		NgIf,
		TranslateModule,
		CardComponent,
		ServiceFormImageComponent,
		NgForOf
	]
})
export class ImageBlockComponent {

	@Input({ required: true })
	public presentationForm!: ServicePresentationForm;

	@ViewChildren(ServiceFormImageComponent)
	public serviceFormImageComponent!: QueryList<ServiceFormImageComponent>;

	public readonly toggleInfo = new BooleanState(true);

	public readonly control = new FormControl();

	public readonly patchBannerServiceApiAdapter = inject(PatchBannerServiceApiAdapter);
	public readonly deleteBannerServiceApiAdapter = inject(DeleteBannerServiceApiAdapter);

	public async save(serviceId: string): Promise<void> {

		for (const component of this.serviceFormImageComponent.toArray()) {

			if (component.mediaState === MediaStateEnum.NOT_CHANGED) {
				continue;
			}

			if (component.mediaState === MediaStateEnum.DELETED) {
				if (!component.banner) {
					continue;
				}
				await this.deleteBannerServiceApiAdapter.executeAsync(serviceId, component.banner._id);
				continue;
			}

			const formData = new FormData();
			formData.append('file', component.selectedFile as Blob);

			if (component.banner) {
				formData.append('_id', component.banner._id);
			}

			await this.patchBannerServiceApiAdapter.executeAsync(serviceId, formData);

		}

	}

	public clear(): void {

		this.serviceFormImageComponent.forEach(component => component.clear());

	}

}
