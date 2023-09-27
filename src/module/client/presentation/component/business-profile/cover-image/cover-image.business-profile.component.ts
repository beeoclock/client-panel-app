import {Component, inject, Input, ViewChild, ViewEncapsulation} from "@angular/core";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {TranslateModule} from "@ngx-translate/core";
import {FormControl} from "@angular/forms";
import {NgIf} from "@angular/common";
import {BooleanState} from "@utility/domain";
import {DragAndDropDirective} from "@utility/presentation/directives/drag-and-drop/drag-and-drop.directive";
import {PlaceholderImageComponent} from "@utility/presentation/component/image/placeholder.image.component";
import {
	ImageCoverImageBusinessProfileComponent
} from "@client/presentation/component/business-profile/cover-image/image.cover-image.business-profile/image.cover-image.business-profile.component";
import {BocMediaService} from "@module/media/presentation/directive/boc-media/boc-media.service";
import {
	PatchMediaBannersClientApiAdapter
} from "@client/adapter/external/api/media/banners/patch.media.banners.client.api.adapter";
import {is} from "thiis";

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
		ImageCoverImageBusinessProfileComponent
	],
	standalone: true
})
export class CoverImageBusinessProfileComponent {

	@Input()
	public control = new FormControl();

	@Input()
	public mediaId = '';

	@ViewChild(ImageCoverImageBusinessProfileComponent)
	public imageCoverImageBusinessProfileComponent!: ImageCoverImageBusinessProfileComponent;

	public readonly toggleInfo = new BooleanState(true);

	public readonly srcByMediaIdService = inject(BocMediaService);
	public readonly patchMediaBannersClientApiAdapter = inject(PatchMediaBannersClientApiAdapter);

	public async save(): Promise<void> {

		if (this.imageCoverImageBusinessProfileComponent.mediaIsChanged.isOff) {
			return;
		}

		const body: {
			media: string;
			_id?: string;
		} = {
			media: this.control.value,
		};

		if (is.string(this.mediaId)) {
			body._id = this.mediaId;
		}

		const {_id, media} = await this.patchMediaBannersClientApiAdapter.executeAsync(body);
		await this.srcByMediaIdService.set(_id, media);

		this.imageCoverImageBusinessProfileComponent.mediaIsChanged.switchOff();

	}

}
