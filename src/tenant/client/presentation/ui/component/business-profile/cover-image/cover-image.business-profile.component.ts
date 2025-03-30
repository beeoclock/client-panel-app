import {Component, inject, input, viewChild, ViewEncapsulation} from "@angular/core";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {TranslateModule} from "@ngx-translate/core";
import {NgForOf, NgIf} from "@angular/common";
import {BooleanState} from "@utility/domain";
import {DragAndDropDirective} from "@utility/presentation/directives/drag-and-drop/drag-and-drop.directive";
import {PlaceholderImageComponent} from "@utility/presentation/component/image/placeholder.image.component";
import {
	ImageCoverImageBusinessProfileComponent
} from "@tenant/client/presentation/ui/component/business-profile/cover-image/image.cover-image.business-profile/image.cover-image.business-profile.component";
import {
	PatchMediaBannersClientApiAdapter
} from "@tenant/client/infrastructure/data-source/api/media/banners/patch.media.banners.client.api.adapter";
import {RIMedia} from "@tenant/media/domain/interface/i.media";
import {MediaStateEnum} from "@utility/presentation/component/image/base.image.component";

@Component({
	selector: 'client-cover-image-business-profile-component',
	templateUrl: './cover-image.business-profile.component.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		CardComponent,
		TranslateModule,
		NgIf,
		DragAndDropDirective,
		PlaceholderImageComponent,
		ImageCoverImageBusinessProfileComponent,
		NgForOf
	],
	standalone: true
})
export class CoverImageBusinessProfileComponent {

	public readonly banners = input<RIMedia[]>([]);

	readonly imageCoverImageBusinessProfileComponent = viewChild.required(ImageCoverImageBusinessProfileComponent);

	public readonly toggleInfo = new BooleanState(true);
	public readonly patchMediaBannersClientApiAdapter = inject(PatchMediaBannersClientApiAdapter);

	public async save(): Promise<void> {

		const imageCoverImageBusinessProfileComponent = this.imageCoverImageBusinessProfileComponent();
  if (imageCoverImageBusinessProfileComponent.mediaState === MediaStateEnum.NOT_CHANGED) {
			return;
		}

		const formData = new FormData();
		formData.append('file', imageCoverImageBusinessProfileComponent.selectedFile as Blob);

		const banner = imageCoverImageBusinessProfileComponent.banner();
  if (banner) {
			formData.append('_id', banner._id);
		}

		await this.patchMediaBannersClientApiAdapter.executeAsync(formData);

		imageCoverImageBusinessProfileComponent.mediaState = MediaStateEnum.NOT_CHANGED;

	}

}
