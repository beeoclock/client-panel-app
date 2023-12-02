import {Component, EventEmitter, Input, Output, ViewEncapsulation} from "@angular/core";
import {TranslateModule} from "@ngx-translate/core";
import {NgIf} from "@angular/common";
import {DragAndDropDirective} from "@utility/presentation/directives/drag-and-drop/drag-and-drop.directive";
import {PlaceholderImageComponent} from "@utility/presentation/component/image/placeholder.image.component";
import {InvalidTooltipComponent} from "@utility/presentation/component/invalid-message/invalid-message";
import {BaseImageV1Component} from "@utility/presentation/component/image/base.image.v1.component";

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
export class ImageGalleryBusinessProfileComponent extends BaseImageV1Component {

	@Input()
	public index = 0;

	@Output()
	public readonly remove = new EventEmitter<void>();

}
