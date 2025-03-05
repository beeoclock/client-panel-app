import {
	ChangeDetectorRef,
	Component,
	inject,
	Input,
	OnChanges,
	SimpleChange,
	SimpleChanges,
	viewChildren,
	ViewEncapsulation
} from "@angular/core";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {TranslateModule} from "@ngx-translate/core";
import {NgForOf} from "@angular/common";
import {GalleryForm} from "@client/presentation/form/gallery.form";
import {BooleanState} from "@utility/domain";
import {
	ImageGalleryBusinessProfileComponent
} from "@client/presentation/component/business-profile/gallery/image.gallery.business-profile/image.gallery.business-profile.component";
import {
	PatchMediaGalleryClientApiAdapter
} from "@client/infrastructure/api/media/gallery/patch.media.gallery.client.api.adapter";
import {
	DeleteMediaGalleryClientApiAdapter
} from "@client/infrastructure/api/media/gallery/delete.media.gallery.client.api.adapter";
import {RIMedia} from "@media/domain/interface/i.media";
import {MediaStateEnum} from "@utility/presentation/component/image/base.image.component";

@Component({
	selector: 'client-gallery-business-profile-component',
	encapsulation: ViewEncapsulation.None,
	imports: [
		CardComponent,
		TranslateModule,
		ImageGalleryBusinessProfileComponent,
		NgForOf,
	],
	standalone: true,
	templateUrl: './gallery.business-profile.component.html'
})
export class GalleryBusinessProfileComponent implements OnChanges {

	@Input()
	public form = new GalleryForm();

	@Input()
	public gallery: RIMedia[] = [];

	public readonly toggleInfo = new BooleanState(true);

	readonly imageGalleryBusinessProfileComponents = viewChildren(ImageGalleryBusinessProfileComponent);

	public readonly changeDetectorRef = inject(ChangeDetectorRef);
	public readonly patchMediaGalleryClientApiAdapter = inject(PatchMediaGalleryClientApiAdapter);
	public readonly deleteMediaGalleryClientApiAdapter = inject(DeleteMediaGalleryClientApiAdapter);

	public readonly removedImages = new Set<string>();

	public ngOnChanges(changes: SimpleChanges & { gallery: SimpleChange }): void {

		if (changes?.gallery) {

			if (changes.gallery.currentValue !== changes.gallery.previousValue) {

				if (this.form.controls.images.length) {
					this.form = new GalleryForm();
				}

				this.gallery = changes.gallery.currentValue.filter((item: RIMedia | null) => item);

				this.fillFormByGallery().then(() => {

					this.changeDetectorRef.detectChanges();

				});

			}

		}

	}

	public async save(): Promise<void> {

		// TODO add service for the job and keep order/queue (first delete then add it is important)
		for (const _id of this.removedImages.values()) {

			// REMOVE IMAGE
			await this.deleteMediaGalleryClientApiAdapter.executeAsync(_id);
			this.gallery = this.gallery.filter((item) => item._id !== _id);
			this.removedImages.delete(_id);

		}

		for (const component of this.imageGalleryBusinessProfileComponents()) {

			if (!component) {
				continue;
			}

			if (component.mediaState === MediaStateEnum.NOT_CHANGED) {
				continue;
			}

			if (!component.selectedFile) {
				continue;
			}

			const formData = new FormData();
			formData.append('file', component.selectedFile as Blob);

			const banner = component.banner();
   if (banner) {
				formData.append('_id', banner._id);
			}

			await this.patchMediaGalleryClientApiAdapter.executeAsync(formData);

			component.mediaState = MediaStateEnum.NOT_CHANGED;

		}

	}

	public removeImage(index: number): void {
		if (this.gallery[index]) {
			this.removedImages.add(this.gallery[index]._id);
			this.gallery = this.gallery.filter((item, itemIndex) => itemIndex !== index);
		}
		this.form.removeImage(index);
	}

	private async fillFormByGallery() {
		for (const media of this.gallery) {
			const index: number = this.gallery.indexOf(media);

			const mediaFile = await this.getFileByHttp(media);

			const control = this.form.controls.images.controls[index];
			if (control) {
				control.patchValue(mediaFile);
			} else {
				this.form.pushImage(mediaFile);
			}

			this.changeDetectorRef.detectChanges();

		}
	}

	private async getFileByHttp(media: RIMedia): Promise<File> {
		const response = await fetch(media.url);
		return new File([await response.blob()], media.url, {type: media.mediaType});
	}
}
