import {Component, ViewEncapsulation} from "@angular/core";
import {PlaceholderImageComponent} from "@shared/presentation/component/image/placeholder.image.component";
import {DragAndDropDirective} from "@shared/presentation/directives/drag-and-drop/drag-and-drop.directive";
import {NgIf} from "@angular/common";
import {BaseImageComponent} from "@shared/presentation/component/image/base.image.component";

@Component({
	selector: 'client-image-cover-image-business-profile-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		PlaceholderImageComponent,
		DragAndDropDirective,
		NgIf
	],
	template: `
		<div
			#labelOfDragAndDropZone
			dragAndDrop
			(fileDropped)="onFilesDropped($event)"
			class="flex items-center justify-center w-full">
			<label
				for="dropzone-file"
				class="flex flex-col items-center justify-center w-full relative h-64 border-2 border-beeColor-300 border-dashed rounded-xl cursor-pointer bg-beeColor-50 hover:bg-beeColor-100 dark:bg-beeColor-700 dark:border-beeDarkColor-600 dark:hover:border-beeDarkColor-500 dark:hover:bg-beeDarkColor-600">
				<img
					#previewImage
					class="absolute top-0 left-0 object-cover rounded-xl w-full h-full hidden"
					alt="Uploaded Image"/>
				@if (showHit()) {

					<utility-placeholder-image-component [labelOfDragAndDropZone]="labelOfDragAndDropZone"/>
				}
				<input
					id="dropzone-file"
					type="file"
					#fileInput
					class="hidden"
					(change)="onFileSelected($event)"
					accept="image/*"/>
			</label>
		</div>
	`
})
export class ImageCoverImageBusinessProfileComponent extends BaseImageComponent {

}
