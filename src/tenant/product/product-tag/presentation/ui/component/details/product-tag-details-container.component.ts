import {Component, input, ViewEncapsulation} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {Dispatch} from '@ngxs-labs/dispatch-decorator';
import {DeleteButtonComponent} from "@shared/presentation/component/button/delete.button.component";
import {DynamicDatePipe} from "@shared/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {StateEnum} from "@core/shared/enum/state.enum";
import {IProductTag} from "@tenant/product/product-tag/domain";
import {ProductTagDataActions} from "@tenant/product/product-tag/infrastructure/state/data/product-tag.data.actions";
import EProductTag from "@tenant/product/product-tag/domain/entity/e.product-tag";
import {
	ProductTagPresentationActions
} from "@tenant/product/product-tag/infrastructure/state/presentation/product-tag.presentation.actions";

@Component({
	selector: 'product-tag-detail-page',
	templateUrl: './product-tag-details-container.component.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		TranslateModule,
		DynamicDatePipe,
		DeleteButtonComponent,
	],
	standalone: true,
})
export class ProductTagDetailsContainerComponent {
	public readonly item = input.required<IProductTag.DTO>();

	@Dispatch()
	public async delete(product: IProductTag.DTO) {
		return new ProductTagDataActions.SetState(product, StateEnum.deleted);
	}

	@Dispatch()
	public openForm() {
		const item = this.item();
		if (!item) {
			return;
		}
		return new ProductTagPresentationActions.OpenForm({componentInputs: {item: EProductTag.fromDTO(item)}});
	}
}

export default ProductTagDetailsContainerComponent;
