import {Component, Input, ViewEncapsulation} from "@angular/core";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {TranslateModule} from "@ngx-translate/core";
import {NgForOf, NgIf} from "@angular/common";
import {DragAndDropDirective} from "@utility/presentation/directives/drag-and-drop/drag-and-drop.directive";
import {GalleryForm} from "@client/presentation/form/gallery.form";
import {BooleanState} from "@utility/domain";
import {
	ImageGalleryBusinessProfileComponent
} from "@client/presentation/component/business-profile/gallery/image.gallery.business-profile/image.gallery.business-profile.component";

@Component({
	selector: 'client-gallery-business-profile-component',
	encapsulation: ViewEncapsulation.None,
	imports: [
		CardComponent,
		TranslateModule,
		NgIf,
		DragAndDropDirective,
		ImageGalleryBusinessProfileComponent,
		NgForOf
	],
	standalone: true,
	templateUrl: 'gallery.business-profile.component.html'
})
export class GalleryBusinessProfileComponent {

	@Input()
	public form = new GalleryForm();

	public readonly toggleInfo = new BooleanState(true);


}
