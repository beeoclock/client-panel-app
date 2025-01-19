import { Component, input, ViewEncapsulation } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TableListComponent } from '@product/presentation/component/list/table/table.list.component';
import LayoutListComponent from '@utility/layout.list.component';
import { ITableState } from '@utility/domain/table.state';
import { IProduct } from '@product/domain';
import { FilterComponent } from '@product/presentation/component/filter/filter.component';
import { AutoRefreshButtonComponent } from '@product/presentation/component/auto-refresh/auto-refresh.button.component';
import { NotFoundTableDataComponent } from '@utility/presentation/component/not-found-table-data/not-found-table-data.component';

@Component({
	selector: 'product-desktop-layout-list-component',
	templateUrl: './desktop.layout.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		TableListComponent,
		FilterComponent,
		NotFoundTableDataComponent,
		TranslateModule,
		AutoRefreshButtonComponent
	],
})
export class DesktopLayoutListComponent extends LayoutListComponent<IProduct> {
	public override readonly tableState =
		input.required<ITableState<IProduct> | null>();

	public openForm(): void {}
}
