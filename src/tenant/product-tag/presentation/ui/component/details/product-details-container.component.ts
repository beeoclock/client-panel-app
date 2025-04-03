import {CurrencyPipe} from '@angular/common';
import {Component, inject, input, ViewEncapsulation} from '@angular/core';
import {IonChip} from '@ionic/angular/standalone';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {Dispatch} from '@ngxs-labs/dispatch-decorator';
import {Store} from '@ngxs/store';
import {firstValueFrom} from 'rxjs';
import {DeleteButtonComponent} from "@shared/presentation/component/button/delete.button.component";
import {ActiveStyleDirective} from "@shared/presentation/directives/active-style/active-style.directive";
import {DynamicDatePipe} from "@shared/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {EditButtonComponent} from "@shared/presentation/component/button/edit.button.component";
import {NoDataPipe} from "@shared/presentation/pipes/no-data.pipe";
import {IProduct} from "@tenant/product/domain";
import {ProductDataActions} from "@tenant/product/infrastructure/state/data/product.data.actions";
import {StateEnum} from "@core/shared/enum/state.enum";
import {
	ProductPresentationActions
} from "@tenant/product/infrastructure/state/presentation/product.presentation.actions";
import EProduct from "@tenant/product/domain/entity/e.product";

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

	readonly #store = inject(Store);
	readonly #translateService = inject(TranslateService);

	public async delete(product: IProduct.DTO) {
		if (this.item().active) {
			alert(this.#translateService.instant('product.deactivateBeforeDelete'));
			return;
		}
		await firstValueFrom(
			this.#store.dispatch(new ProductDataActions.SetState(product, StateEnum.deleted))
		);
	}

	@Dispatch()
	public openForm() {
		const item = this.item();
		if (!item) {
			return;
		}
		return new ProductPresentationActions.OpenForm({componentInputs: {item: EProduct.fromDTO(item)}});
	}
}

export default ProductDetailsContainerComponent;
