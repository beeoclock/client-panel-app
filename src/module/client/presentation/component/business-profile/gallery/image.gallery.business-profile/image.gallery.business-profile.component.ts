import {Component, input, output, ViewEncapsulation} from "@angular/core";
import {TranslateModule} from "@ngx-translate/core";
import {NgIf} from "@angular/common";
import {DragAndDropDirective} from "@utility/presentation/directives/drag-and-drop/drag-and-drop.directive";
import {PlaceholderImageComponent} from "@utility/presentation/component/image/placeholder.image.component";
import {InvalidTooltipComponent} from "@utility/presentation/component/invalid-message/invalid-message";
import {BaseImageComponent, MediaStateEnum} from "@utility/presentation/component/image/base.image.component";
import {FormControl} from "@angular/forms";
import {file2base64} from "@utility/domain/file2base64";

@Component({
	selector: 'client-image-gallery-business-profile-component',
	encapsulation: ViewEncapsulation.None,
	imports: [
		TranslateModule,
		NgIf,
		DragAndDropDirective,
		PlaceholderImageComponent,
		InvalidTooltipComponent
	],
	standalone: true,
	templateUrl: './image.gallery.business-profile.component.html'
})
export class ImageGalleryBusinessProfileComponent extends BaseImageComponent {

	public readonly control = input.required<FormControl>();

	public readonly remove = output<void>();

	public get isEmptyControl(): boolean {
		return !this.control().value;
	}

	public get isNotEmptyControl(): boolean {
		return !this.isEmptyControl;
	}
	/**
	 *
	 * @param files - files to work with
	 * @private
	 */
	protected override async workWithFiles([file]: File[]): Promise<void> {

		try {

			this.selectedFile = file;
			const base64 = await file2base64(file);
			this.mediaState = MediaStateEnum.CHANGED;
			this.control().patchValue(base64);
			this.updateSrc(base64);

		} catch (e) {
			this.logger.error(e);
		}

	}

}
