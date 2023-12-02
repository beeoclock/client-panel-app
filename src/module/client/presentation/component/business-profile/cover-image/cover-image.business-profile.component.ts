import {Component, inject, Input, ViewChild, ViewEncapsulation} from "@angular/core";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {TranslateModule} from "@ngx-translate/core";
import {FormControl} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {BooleanState} from "@utility/domain";
import {DragAndDropDirective} from "@utility/presentation/directives/drag-and-drop/drag-and-drop.directive";
import {PlaceholderImageComponent} from "@utility/presentation/component/image/placeholder.image.component";
import {
	ImageCoverImageBusinessProfileComponent
} from "@client/presentation/component/business-profile/cover-image/image.cover-image.business-profile/image.cover-image.business-profile.component";
import {
	PatchMediaBannersClientApiAdapter
} from "@client/adapter/external/api/media/banners/patch.media.banners.client.api.adapter";
import {RIMedia} from "@module/media/domain/interface/i.media";

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

	@Input()
	public control = new FormControl();

	@Input()
	public banners: RIMedia[] = [];

	@ViewChild(ImageCoverImageBusinessProfileComponent)
	public imageCoverImageBusinessProfileComponent!: ImageCoverImageBusinessProfileComponent;

	public readonly toggleInfo = new BooleanState(true);
	public readonly patchMediaBannersClientApiAdapter = inject(PatchMediaBannersClientApiAdapter);

	public async save(): Promise<void> {

		if (this.imageCoverImageBusinessProfileComponent.mediaIsChanged.isOff) {
			return;
		}

		console.log(new Function('target', 'target === null')(null))

		const formData = new FormData();
		formData.append('file', this.imageCoverImageBusinessProfileComponent.selectedFile as Blob);

		if (this.imageCoverImageBusinessProfileComponent.banner) {
			formData.append('_id', this.imageCoverImageBusinessProfileComponent.banner._id);
		}

		await this.patchMediaBannersClientApiAdapter.executeAsync(formData);

		this.imageCoverImageBusinessProfileComponent.mediaIsChanged.switchOff();

	}

}
