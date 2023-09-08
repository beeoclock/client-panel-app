import {Component} from '@angular/core';
import {NgIf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {SrcByMediaIdDirective} from "@module/media/presentation/directive/src-by-media-id/src-by-media-id.directive";
import {DragAndDropDirective} from "@utility/presentation/directives/drag-and-drop/drag-and-drop.directive";
import {BaseImageComponent} from "@utility/presentation/component/image/base.image.component";
import {PlaceholderImageComponent} from "@utility/presentation/component/image/placeholder.image.component";

@Component({
	selector: 'service-form-image-component',
	standalone: true,
	templateUrl: `service-form-image.component.html`,
	imports: [
		NgIf,
		TranslateModule,
		SrcByMediaIdDirective,
		DragAndDropDirective,
		PlaceholderImageComponent
	]
})
export class ServiceFormImageComponent extends BaseImageComponent {

}
