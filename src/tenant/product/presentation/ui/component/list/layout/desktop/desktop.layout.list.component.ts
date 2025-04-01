import {Component, ViewEncapsulation} from '@angular/core';
import LayoutListComponent from "@shared/layout.list.component";
import {ProductActions} from "@tenant/product/infrastructure/state/product/product.actions";
import {FilterComponent} from "@tenant/product/presentation/ui/component/filter/filter.component";
import {TableListComponent} from "@tenant/product/presentation/ui/component/list/table/table.list.component";

@Component({
	selector: 'product-desktop-layout-list-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		FilterComponent,
		TableListComponent,
	],
	template: `
		<product-filter-component/>
		<product-table-list-component/>
	`,
})
export class DesktopLayoutListComponent extends LayoutListComponent {

	public openForm(): void {
		this.store.dispatch(new ProductActions.OpenForm());
	}
}
