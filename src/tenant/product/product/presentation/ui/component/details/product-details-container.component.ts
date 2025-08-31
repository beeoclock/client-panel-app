import {CurrencyPipe} from '@angular/common';
import {Component, input, ViewEncapsulation} from '@angular/core';
import {IonChip} from '@ionic/angular/standalone';
import {TranslateModule} from '@ngx-translate/core';
import {Dispatch} from '@ngxs-labs/dispatch-decorator';
import {DeleteButtonComponent} from "@shared/presentation/ui/component/button/delete.button.component";
import {ActiveStyleDirective} from "@shared/presentation/directives/active-style/active-style.directive";
import {DynamicDatePipe} from "@shared/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {EditButtonComponent} from "@shared/presentation/ui/component/button/edit.button.component";
import {NoDataPipe} from "@shared/presentation/pipes/no-data.pipe";
import {IProduct} from "@tenant/product/product/domain";
import {ProductDataActions} from "@tenant/product/product/infrastructure/state/data/product.data.actions";
import {StateEnum} from "@core/shared/enum/state.enum";
import {
	ProductPresentationActions
} from "@tenant/product/product/infrastructure/state/presentation/product.presentation.actions";
import EProduct from "@tenant/product/product/domain/entity/e.product";

@Component({
	selector: 'product-detail-page',
	templateUrl: './product-details-container.component.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		TranslateModule,
		ActiveStyleDirective,
		DynamicDatePipe,
		CurrencyPipe,
		IonChip,
		DeleteButtonComponent,
		EditButtonComponent,
		NoDataPipe
	],
	standalone: true,
})
export class ProductDetailsContainerComponent {
	public readonly item = input.required<IProduct.DTO>();

	@Dispatch()
	public async delete(product: IProduct.DTO) {
		return new ProductDataActions.SetState(product, StateEnum.deleted)
	}

	@Dispatch()
	public openForm() {
		const item = this.item();
		const componentInputs = {
			item: EProduct.fromDTO(item),
			isEditMode: true,
		};
		return new ProductPresentationActions.OpenForm({componentInputs});
	}
}

export default ProductDetailsContainerComponent;
