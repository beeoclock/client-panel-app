import {
	Component,
	input,
	Input,
	ViewEncapsulation,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IProduct } from '@product/domain';

@Component({
	selector: 'product-form-page',
	templateUrl: './product-form-container.component.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		ReactiveFormsModule,
		TranslateModule
	],
	standalone: true,
})
export class ProductFormContainerComponent  {

	public readonly item = input<IProduct | undefined>();

	@Input()
	private isEditMode = false;
}
