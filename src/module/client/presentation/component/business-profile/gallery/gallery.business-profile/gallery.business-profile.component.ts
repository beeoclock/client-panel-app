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
import {NgForOf} from "@angular/common";
import {GalleryForm} from "@client/presentation/form/gallery.form";
import {BooleanState} from "@utility/domain";
import {
	ImageGalleryBusinessProfileComponent
} from "@client/presentation/component/business-profile/gallery/image.gallery.business-profile/image.gallery.business-profile.component";
import {SrcByMediaIdService} from "@module/media/presentation/directive/src-by-media-id/src-by-media-id.service";
import {
	PatchMediaGalleryClientApiAdapter
} from "@client/adapter/external/api/media/gallery/patch.media.gallery.client.api.adapter";

@Component({
	selector: 'client-gallery-business-profile-component',
	encapsulation: ViewEncapsulation.None,
	imports: [
		CardComponent,
		TranslateModule,
		ImageGalleryBusinessProfileComponent,
		NgForOf
	],
	standalone: true,
	templateUrl: 'gallery.business-profile.component.html'
})
export class GalleryBusinessProfileComponent implements OnChanges {

	@Input()
	public form = new GalleryForm();

	@Input()
	public gallery: string[] = [];

	public readonly toggleInfo = new BooleanState(true);

	@ViewChildren(ImageGalleryBusinessProfileComponent)
	public imageGalleryBusinessProfileComponents!: QueryList<ImageGalleryBusinessProfileComponent>;

	public readonly srcByMediaIdService = inject(SrcByMediaIdService);
	public readonly patchMediaGalleryClientApiAdapter = inject(PatchMediaGalleryClientApiAdapter);

	public ngOnChanges(changes: SimpleChanges & { gallery: SimpleChange }): void {

		if (changes) {

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

		for (const indexStr in this.imageGalleryBusinessProfileComponents.toArray()) {

			const index = +indexStr;
			const item = this.imageGalleryBusinessProfileComponents.get(index);

			if (!item) {
				continue;
			}

			if (item.mediaIsChanged.isOff) {
				continue;
			}

			const body: {
				media: string;
				_id?: string;
			} = {
				media: item.control.value,
			};

			if (this.gallery[index]) {
				body._id = this.gallery[index];
			}

			const {_id, media} = await this.patchMediaGalleryClientApiAdapter.executeAsync(body);
			await this.srcByMediaIdService.set(_id, media);

			item.mediaIsChanged.switchOff();

		}

	}


}
