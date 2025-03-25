import {Component, inject, input, viewChildren} from '@angular/core';
import {NgForOf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {FormControl} from "@angular/forms";
import {
	PatchBannerServiceApiAdapter
} from "@[tenant]/service/infrastructure/data-source/api/patch.banner.service.api.adapter";
import {BooleanState} from "@utility/domain";
import {
	ServiceFormImageComponent
} from "@[tenant]/service/presentation/ui/component/form/v2/image/service-form-image/service-form-image.component";
import {ServicePresentationForm} from '@[tenant]/service/presentation/form/service.presentation.form';
import {
	DeleteBannerServiceApiAdapter
} from "@[tenant]/service/infrastructure/data-source/api/delete.banner.service.api.adapter";
import {MediaStateEnum} from "@utility/presentation/component/image/base.image.component";

@Component({
	selector: 'service-form-image-block-component',
	templateUrl: './image-block.component.html',
	standalone: true,
	imports: [
		TranslateModule,
		CardComponent,
		ServiceFormImageComponent,
		NgForOf
	]
})
export class ImageBlockComponent {

	public readonly presentationForm = input.required<ServicePresentationForm>();

	readonly serviceFormImageComponent = viewChildren(ServiceFormImageComponent);

	public readonly toggleInfo = new BooleanState(true);

	public readonly control = new FormControl();

	public readonly patchBannerServiceApiAdapter = inject(PatchBannerServiceApiAdapter);
	public readonly deleteBannerServiceApiAdapter = inject(DeleteBannerServiceApiAdapter);

	public async save(serviceId: string): Promise<void> {

		for (const component of this.serviceFormImageComponent()) {

			if (component.mediaState === MediaStateEnum.NOT_CHANGED) {
				continue;
			}

			if (component.mediaState === MediaStateEnum.DELETED) {
				const banner = component.banner();
				if (!banner) {
					continue;
				}
				await this.deleteBannerServiceApiAdapter.executeAsync(serviceId, banner._id);
				continue;
			}

			const formData = new FormData();
			formData.append('file', component.selectedFile as Blob);

			const banner = component.banner();
			if (banner) {
				formData.append('_id', banner._id);
			}

			await this.patchBannerServiceApiAdapter.executeAsync(serviceId, formData);

		}

	}

	public clear(): void {

		this.serviceFormImageComponent().forEach(component => component.clear());

	}

}
