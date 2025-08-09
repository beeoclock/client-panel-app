import {Component} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {DragAndDropDirective} from "@shared/presentation/directives/drag-and-drop/drag-and-drop.directive";
import {BaseImageComponent} from "@shared/presentation/component/image/base.image.component";
import {PlaceholderImageComponent} from "@shared/presentation/component/image/placeholder.image.component";

@Component({
	selector: 'image-input',
	standalone: true,
	templateUrl: './image-input.html',
	imports: [
		TranslateModule,
		DragAndDropDirective,
		PlaceholderImageComponent,
	]
})
export class ImageInput extends BaseImageComponent {

}
