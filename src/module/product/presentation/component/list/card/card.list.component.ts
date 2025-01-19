import { Component, ViewEncapsulation } from '@angular/core';
import { AsyncPipe, CurrencyPipe, NgFor } from '@angular/common';
import { TableStatePaginationComponent } from '@utility/presentation/component/pagination/table-state-pagination.component';
import { TranslateModule } from '@ngx-translate/core';
import { TableComponent } from '@utility/table.component';
import { CardComponent } from '@utility/presentation/component/card/card.component';
import { BooleanStreamState } from '@utility/domain/boolean-stream.state';
import { IProduct } from '@product/domain';
import { DynamicDatePipe } from '@utility/presentation/pipes/dynamic-date/dynamic-date.pipe';
import { IonChip } from '@ionic/angular/standalone';
import { ProductActions } from '@product/state/product/product.actions';
import { RowActionButtonComponent } from '@product/presentation/component/row-action-button/row-action-button.component';
import { NoDataPipe } from '@utility/presentation/pipes/no-data.pipe';

@Component({
	selector: 'product-card-list-component',
	templateUrl: './card.list.component.html',
standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		TableStatePaginationComponent,
		TranslateModule,
		CardComponent,
		AsyncPipe,
		NoDataPipe,
		CurrencyPipe,
		DynamicDatePipe,
		IonChip,
		NgFor,
		RowActionButtonComponent
	],
})
export class CardListComponent extends TableComponent<IProduct> {
	public showAction = new BooleanStreamState(true);
	public showSelectedStatus = new BooleanStreamState(false);

	public override open(item: IProduct): void {
		this.store.dispatch(new ProductActions.OpenDetails(item));
	}
}
