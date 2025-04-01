import {CurrencyPipe} from '@angular/common';
import {Component, inject, input, ViewEncapsulation} from '@angular/core';
import {IonChip} from '@ionic/angular/standalone';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {Dispatch} from '@ngxs-labs/dispatch-decorator';
import {Store} from '@ngxs/store';
import {IProduct} from '@product/domain';
import {ProductActions} from '@product/state/product/product.actions';
import {NoDataPipe} from '@src/module/utility/presentation/pipes/no-data.pipe';
import {DeleteButtonComponent} from '@utility/presentation/component/button/delete.button.component';
import {EditButtonComponent} from '@utility/presentation/component/button/edit.button.component';
import {ActiveStyleDirective} from '@utility/presentation/directives/active-style/active-style.directive';
import {DynamicDatePipe} from '@utility/presentation/pipes/dynamic-date/dynamic-date.pipe';
import {firstValueFrom} from 'rxjs';

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
	public readonly item = input.required<IProduct>();

	readonly #store = inject(Store);
	readonly #translateService = inject(TranslateService);

	public async delete(product: IProduct) {
		if(this.item().active) {
			alert(this.#translateService.instant('product.deactivateBeforeDelete'));
			return;
		}
		await firstValueFrom(
			this.#store.dispatch(new ProductActions.DeleteItem(product._id))
		);
	}

	@Dispatch()
	public openForm() {
		const item = this.item();
		if (!item) {
			return;
		}
		return new ProductActions.OpenFormToEditById(item?._id);
	}
}
