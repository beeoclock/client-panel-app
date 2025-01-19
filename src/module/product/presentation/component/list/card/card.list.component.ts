import { Component, ViewEncapsulation } from '@angular/core';
import { AsyncPipe, CurrencyPipe, NgFor } from '@angular/common';
import { TableStatePaginationComponent } from '@utility/presentation/component/pagination/table-state-pagination.component';
import { TranslateModule } from '@ngx-translate/core';
import { TableComponent } from '@utility/table.component';
import { CardComponent } from '@utility/presentation/component/card/card.component';
import { NoDataPipe } from '@utility/presentation/pipes/no-data.pipe';
import { BooleanStreamState } from '@utility/domain/boolean-stream.state';
import { IProduct } from '@product/domain';

@Component({
	selector: 'product-card-list-component',
	templateUrl: './card.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		TableStatePaginationComponent,
		TranslateModule,
		CardComponent,
		NoDataPipe,
		AsyncPipe,
		CurrencyPipe
	],
})
export class CardListComponent extends TableComponent<IProduct> {
	public showAction = new BooleanStreamState(true);

	public showSelectedStatus = new BooleanStreamState(false);

	public override open(item: IProduct) {}
}
