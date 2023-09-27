import {Component, EventEmitter, Input, Output, ViewEncapsulation} from "@angular/core";
import {TranslateModule} from "@ngx-translate/core";
import {NgIf} from "@angular/common";
import {DragAndDropDirective} from "@utility/presentation/directives/drag-and-drop/drag-and-drop.directive";
import {BocMediaDirective} from "@module/media/presentation/directive/boc-media/boc-media.directive";
import {BaseImageComponent} from "@utility/presentation/component/image/base.image.component";
import {PlaceholderImageComponent} from "@utility/presentation/component/image/placeholder.image.component";

@Component({
	selector: 'client-image-gallery-business-profile-component',
	encapsulation: ViewEncapsulation.None,
	imports: [
		TranslateModule,
		NgIf,
		DragAndDropDirective,
		BocMediaDirective,
		PlaceholderImageComponent
	],
	standalone: true,
	templateUrl: './image.gallery.business-profile.component.html'
})
export class ImageGalleryBusinessProfileComponent extends BaseImageComponent {

	@Input()
	public index = 0;

	@Output()
	public readonly remove = new EventEmitter<void>();

}
