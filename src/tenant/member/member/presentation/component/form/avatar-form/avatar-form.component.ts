import {Component} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {DragAndDropDirective} from "@shared/presentation/directives/drag-and-drop/drag-and-drop.directive";
import {BaseImageComponent} from "@shared/presentation/ui/component/image/base.image.component";
import {PlaceholderImageComponent} from "@shared/presentation/ui/component/image/placeholder.image.component";

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
