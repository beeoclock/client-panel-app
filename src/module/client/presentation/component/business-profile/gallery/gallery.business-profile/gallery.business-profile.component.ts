import {
	Component,
	inject,
	Input,
	OnChanges,
	QueryList,
	SimpleChange,
	SimpleChanges,
	ViewChildren,
	ViewEncapsulation
} from "@angular/core";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {TranslateModule} from "@ngx-translate/core";
import {NgForOf, NgIf} from "@angular/common";
import {GalleryForm} from "@client/presentation/form/gallery.form";
import {BooleanState} from "@utility/domain";
import {
	ImageGalleryBusinessProfileComponent
} from "@client/presentation/component/business-profile/gallery/image.gallery.business-profile/image.gallery.business-profile.component";
import {BocMediaService} from "@module/media/presentation/directive/boc-media/boc-media.service";
import {
	PatchMediaGalleryClientApiAdapter
} from "@client/adapter/external/api/media/gallery/patch.media.gallery.client.api.adapter";
import {
	DeleteMediaGalleryClientApiAdapter
} from "@client/adapter/external/api/media/gallery/delete.media.gallery.client.api.adapter";

@Component({
	selector: 'client-gallery-business-profile-component',
	encapsulation: ViewEncapsulation.None,
	imports: [
		CardComponent,
		TranslateModule,
		ImageGalleryBusinessProfileComponent,
		NgForOf,
		NgIf
	],
	standalone: true,
	templateUrl: './gallery.business-profile.component.html'
})
export class GalleryBusinessProfileComponent implements OnChanges {

	@Input()
	public form = new GalleryForm();

	@Input()
	public gallery: string[] = [];

	public readonly toggleInfo = new BooleanState(true);

	@ViewChildren(ImageGalleryBusinessProfileComponent)
	public imageGalleryBusinessProfileComponents!: QueryList<ImageGalleryBusinessProfileComponent>;

	public readonly srcByMediaIdService = inject(BocMediaService);
	public readonly patchMediaGalleryClientApiAdapter = inject(PatchMediaGalleryClientApiAdapter);
	public readonly deleteMediaGalleryClientApiAdapter = inject(DeleteMediaGalleryClientApiAdapter);

	public readonly removedImages = new Set<string>();

	public ngOnChanges(changes: SimpleChanges & { gallery: SimpleChange }): void {

		if (changes?.gallery) {

			if (changes.gallery.currentValue !== changes.gallery.previousValue) {

				if (this.form.controls.images.length) {
					this.form = new GalleryForm();
				}

				changes.gallery.currentValue.forEach((mediaId: string, index: number) => {

					this.form.controls.images.controls[index].patchValue(mediaId);

				});

			}

		}

	}

	public async save(): Promise<void> {

		// TODO add service for the job and keep order/queue (first delete then add it is important)
		for (const mediaId of this.removedImages.values()) {

			// REMOVE IMAGE
			await this.deleteMediaGalleryClientApiAdapter.executeAsync(mediaId);
			await this.srcByMediaIdService.delete(mediaId);
			this.gallery = this.gallery.filter((item) => item !== mediaId);
			this.removedImages.delete(mediaId);

		}

		for (let index = 0; index < this.imageGalleryBusinessProfileComponents.toArray().length; index++) {

			const item = this.imageGalleryBusinessProfileComponents.get(index);

			if (!item) {
				continue;
			}

			const mediaId = this.gallery[index];

			if (item.mediaIsChanged.isOff) {
				continue;
			}

			const body: {
				media: string;
				_id?: string;
			} = {
				media: item.control.value,
			};

			if (mediaId) {
				body._id = mediaId;
			}

			const {_id, media} = await this.patchMediaGalleryClientApiAdapter.executeAsync(body);
			this.gallery = [...this.gallery];
			this.gallery[index] = _id;
			await this.srcByMediaIdService.set(_id, media);

			item.mediaIsChanged.switchOff();

		}

	}

	public removeImage(index: number): void {
		if (this.gallery[index]) {
			this.removedImages.add(this.gallery[index]);
			this.gallery = this.gallery.filter((item, itemIndex) => itemIndex !== index);
		}
		this.form.removeImage(index);
	}

	public getMediaId(index: number): string {
		return this.gallery[index] ?? '';
	}
}
