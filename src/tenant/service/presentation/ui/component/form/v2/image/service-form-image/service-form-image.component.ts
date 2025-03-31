import {Component} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {DragAndDropDirective} from "@shared/presentation/directives/drag-and-drop/drag-and-drop.directive";
import {BaseImageComponent} from "@shared/presentation/component/image/base.image.component";
import {PlaceholderImageComponent} from "@shared/presentation/component/image/placeholder.image.component";

@Component({
	selector: 'service-form-image-component',
	standalone: true,
	templateUrl: './service-form-image.component.html',
	imports: [
		TranslateModule,
		DragAndDropDirective,
		PlaceholderImageComponent,
	]
})
export class ServiceFormImageComponent extends BaseImageComponent {

}
