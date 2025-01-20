import { Component, inject, input, ViewEncapsulation } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { IProduct } from '@product/domain';
import { DynamicDatePipe } from '@utility/presentation/pipes/dynamic-date/dynamic-date.pipe';
import { ActiveStyleDirective } from '@utility/presentation/directives/active-style/active-style.directive';
import { CurrencyPipe, NgFor } from '@angular/common';
import { IonChip } from '@ionic/angular/standalone';
import { DeleteButtonComponent } from '@utility/presentation/component/button/delete.button.component';
import { EditButtonComponent } from '@utility/presentation/component/button/edit.button.component';
import { firstValueFrom } from 'rxjs';
import { ProductActions } from '@product/state/product/product.actions';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { NoDataPipe } from '@src/module/utility/presentation/pipes/no-data.pipe';

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
		NgFor,
		DeleteButtonComponent,
		EditButtonComponent,
		NoDataPipe
	],
	standalone: true,
})
export class ProductDetailsContainerComponent {
	public readonly item = input.required<IProduct>();
	public readonly store = inject(Store);

	public async delete(product: IProduct) {
		await firstValueFrom(
			this.store.dispatch(new ProductActions.DeleteItem(product._id))
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