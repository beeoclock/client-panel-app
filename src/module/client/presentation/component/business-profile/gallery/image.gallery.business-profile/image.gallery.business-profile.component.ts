import {Component, EventEmitter, Input, Output, ViewEncapsulation} from "@angular/core";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {TranslateModule} from "@ngx-translate/core";
import {NgIf} from "@angular/common";
import {DragAndDropDirective} from "@utility/presentation/directives/drag-and-drop/drag-and-drop.directive";
import {SrcByMediaIdDirective} from "@module/media/presentation/directive/src-by-media-id/src-by-media-id.directive";
import {BaseImageComponent} from "@utility/presentation/component/image/base.image.component";
import {PlaceholderImageComponent} from "@utility/presentation/component/image/placeholder.image.component";

@Component({
	selector: 'client-image-gallery-business-profile-component',
	encapsulation: ViewEncapsulation.None,
	imports: [
		CardComponent,
		TranslateModule,
		NgIf,
		DragAndDropDirective,
		SrcByMediaIdDirective,
		PlaceholderImageComponent
	],
	standalone: true,
	templateUrl: 'image.gallery.business-profile.component.html'
})
export class ImageGalleryBusinessProfileComponent extends BaseImageComponent {

	@Input()
	public index = 0;

	@Output()
	public readonly remove = new EventEmitter<void>();

}
