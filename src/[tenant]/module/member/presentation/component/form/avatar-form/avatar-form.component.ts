import {Component} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {DragAndDropDirective} from "@utility/presentation/directives/drag-and-drop/drag-and-drop.directive";
import {BaseImageComponent} from "@utility/presentation/component/image/base.image.component";
import {PlaceholderImageComponent} from "@utility/presentation/component/image/placeholder.image.component";

@Component({
	selector: 'member-form-avatar-component',
	standalone: true,
	templateUrl: './avatar-form.component.html',
	imports: [
		TranslateModule,
		DragAndDropDirective,
		PlaceholderImageComponent,
	]
})
export class AvatarFormComponent extends BaseImageComponent {

}
