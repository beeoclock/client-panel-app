import {Component} from '@angular/core';
import {NgIf, NgOptimizedImage} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {DragAndDropDirective} from "@utility/presentation/directives/drag-and-drop/drag-and-drop.directive";
import {BaseImageV2Component} from "@utility/presentation/component/image/base.image.v2.component";
import {PlaceholderImageComponent} from "@utility/presentation/component/image/placeholder.image.component";

@Component({
	selector: 'service-form-image-component',
	standalone: true,
	templateUrl: './service-form-image.component.html',
	imports: [
		NgIf,
		TranslateModule,
		DragAndDropDirective,
		PlaceholderImageComponent,
		NgOptimizedImage
	]
})
export class ServiceFormImageComponent extends BaseImageV2Component {

}
