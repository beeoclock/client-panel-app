import {
	Component,
	input,
	ViewEncapsulation,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { NotFoundTableDataComponent } from '@utility/presentation/component/not-found-table-data/not-found-table-data.component';
import { TranslateModule } from '@ngx-translate/core';
import { FilterComponent } from '@product/presentation/component/filter/filter.component';
import LayoutListComponent from '@utility/layout.list.component';
import { ITableState } from '@utility/domain/table.state';
import { IProduct } from '@product/domain';
import { CardListComponent } from '@product/presentation/component/list/card/card.list.component';
import { AutoRefreshButtonComponent } from '@product/presentation/component/auto-refresh/auto-refresh.button.component';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { ProductActions } from '@src/module/product/state/product/product.actions';

@Component({
	selector: 'product-mobile-layout-list-component',
	templateUrl: './mobile.layout.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		CardListComponent,
		NotFoundTableDataComponent,
		TranslateModule,
		FilterComponent,
		AutoRefreshButtonComponent,
		NgClass,
	],
})
export class MobileLayoutListComponent extends LayoutListComponent<IProduct> {
	public readonly showButtonGoToForm = input(true);
	public override readonly tableState =
		input.required<ITableState<IProduct> | null>();

	@Dispatch()
	public openForm() {
		return new ProductActions.OpenForm();
	}
}
