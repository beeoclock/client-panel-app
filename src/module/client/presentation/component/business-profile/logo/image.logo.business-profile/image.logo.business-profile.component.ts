import {Component, ViewEncapsulation} from "@angular/core";
import {BaseImageComponent} from "@utility/presentation/component/image/base.image.component";
import {PlaceholderImageComponent} from "@utility/presentation/component/image/placeholder.image.component";
import {BocMediaDirective} from "@module/media/presentation/directive/boc-media/boc-media.directive";
import {DragAndDropDirective} from "@utility/presentation/directives/drag-and-drop/drag-and-drop.directive";
import {NgIf} from "@angular/common";

@Component({
	selector: 'client-image-logo-business-profile-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		PlaceholderImageComponent,
		BocMediaDirective,
		DragAndDropDirective,
		NgIf
	],
	template: `
		<div
			#labelOfDragAndDropZone dragAndDrop
			(fileDropped)="onFilesDropped($event)"
			class="flex items-center justify-center">
			<label
				for="logo-business-profile-dropzone-file"
				class="min-w-[192px] max-w-[192px] min-h-[192px] max-h-[192px] flex flex-col items-center justify-center w-full relative border-2 border-beeColor-300 border-dashed rounded-xl cursor-pointer bg-beeColor-50 hover:bg-beeColor-100 dark:hover:bg-beeDarkColor-800 dark:bg-beeColor-700 dark:border-beeDarkColor-600 dark:hover:border-beeDarkColor-500 dark:hover:bg-beeDarkColor-600">
				<img
					#previewImage
					bocMedia
					[src]="mediaId"
					twHeight="h-full"
					twWidth="w-full"
					class="absolute top-0 left-0 object-cover rounded-xl w-full h-full hidden" alt="Uploaded Image"/>
				<utility-placeholder-image-component
					*ngIf="showHit"
					[labelOfDragAndDropZone]="labelOfDragAndDropZone"/>
				<input
					id="logo-business-profile-dropzone-file" type="file" #fileInput class="hidden"
					(change)="onFileSelected($event)"
					accept="image/*"/>
			</label>
		</div>
	`
})
export class ImageLogoBusinessProfileComponent extends BaseImageComponent {

}
