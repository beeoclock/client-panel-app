import {Component, Input, ViewEncapsulation} from "@angular/core";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {TranslateModule} from "@ngx-translate/core";
import {FormControl} from "@angular/forms";
import {NgIf} from "@angular/common";
import {BooleanState} from "@utility/domain";
import {DragAndDropDirective} from "@utility/presentation/directives/drag-and-drop/drag-and-drop.directive";
import {PlaceholderImageComponent} from "@utility/presentation/component/image/placeholder.image.component";
import {
	ImageCoverImageBusinessProfileComponent
} from "@client/presentation/component/business-profile/cover-image/image.cover-image.business-profile/image.cover-image.business-profile.component";

@Component({
	selector: 'client-cover-image-business-profile-component',
	templateUrl: 'cover-image.business-profile.component.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		CardComponent,
		TranslateModule,
		NgIf,
		DragAndDropDirective,
		PlaceholderImageComponent,
		ImageCoverImageBusinessProfileComponent
	],
	standalone: true
})
export class CoverImageBusinessProfileComponent {

	@Input()
	public control = new FormControl();

	public readonly toggleInfo = new BooleanState(true);

}
